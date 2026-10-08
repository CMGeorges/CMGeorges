'use strict';
const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'docs/index.html'), 'utf8');
const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(m => m[1]);
assert.equal(new Set(ids).size, ids.length, 'HTML identifiers must be unique');
for (const link of html.matchAll(/href="#([^"]+)"/g)) assert(ids.includes(link[1]), `Missing anchor ${link[1]}`);
assert.match(html, /<html lang="fr">/);
assert.match(html, /name="viewport"/);
assert(!/\b(?:sk_live_|whsec_)[A-Za-z0-9]{12}/.test(html), 'No payment secrets in HTML');
for (const file of ['README.md', 'PUBLISHING.md', 'docs/.nojekyll']) assert(fs.existsSync(path.join(root, file)), `${file} missing`);
const scripts = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m => m[1]).join('\n');
function element(dataset = {}) {
  return {dataset, handlers: {}, attributes: {}, value: '20,00', textContent: '',
    addEventListener(name, fn) {this.handlers[name] = fn;},
    setAttribute(name, value) {this.attributes[name] = value;}};
}
const elements = Object.fromEntries(ids.map(id => [id, element()]));
const filters = ['all', 'net', 'commerce', 'metier'].map(filter => element({filter}));
const cards = ['net commerce', 'net', 'net', 'net metier'].map(category => element({category}));
const context = vm.createContext({Intl, document: {
  getElementById: id => elements[id],
  querySelectorAll: query => query === '[data-filter]' ? filters : cards,
}, window: {print: () => {}}});
vm.runInContext(scripts, context, {timeout: 1000});
const run = code => vm.runInContext(code, context, {timeout: 1000});
assert.equal(run('parseCents("0,10")'), 10);
assert.throws(() => run('parseCents("0.001")'), /décimales/);
assert.throws(() => run('parseCents("-10")'), /positif/);
assert.throws(() => run('parseCents("0")'), /supérieur/);
const submit = () => elements['transfer-form'].handlers.submit({preventDefault() {}});
submit(); assert.equal(run('balances.a'), 8000); assert.equal(run('balances.b'), 4500);
elements.amount.value = '999'; submit();
assert.equal(run('balances.a'), 8000); assert.equal(run('balances.b'), 4500);
assert.match(elements['demo-status'].textContent, /insuffisant/);
elements['reset-demo'].handlers.click();
for(let i = 0; i < 10; i++) {elements.amount.value = '0,10'; submit();}
assert.equal(run('balances.a + balances.b'), 12500);
assert.equal(run('balances.a'), 9900);
filters[2].handlers.click(); assert.equal(cards.filter(card => !card.hidden).length, 1);
assert.equal(filters[2].attributes['aria-pressed'], 'true');
filters[0].handlers.click(); assert.equal(cards.filter(card => !card.hidden).length, 4);
assert.equal(filters[2].attributes['aria-pressed'], 'false');
console.log('Portfolio checks passed: anchors, offline script, transfer invariants, failure rollback, reset and filters.');
console.log('Browser layout and assistive technology review are not covered by these checks.');
