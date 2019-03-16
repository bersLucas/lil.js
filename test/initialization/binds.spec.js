/* global liljs */
describe('liljs', () => {
  describe('initialization', () => {
    describe('binds', () => {
      const goodText = `
      <div id="app">
        <span lil-text="textValue"></span>
        <span lil-bind="textValue" lil-bind-from="value"></span>
      </div>`;

      const badText = `
      <div id="app">
        <span lil-text="textValue"></span>
        <span lil-bind="someNewValue" lil-bind-from="value"></span>
      </div>`;

      const setUp = (literalHtml) => {
        document.body.innerHTML += literalHtml;
      };

      it('should create a property if it does not exist', () => {
        setUp(goodText);
        const elem = document.querySelector('#app');
        const app = liljs(elem, {});
        expect(app.textValue).toBeDefined();
      });

      it('should add lil-bind elements to the boundedElem array of the property', () => {
        setUp(goodText);
        const elem = document.querySelector('#app');
        const app = liljs(elem, {});
        expect(app.textValue.boundedElem.length).toEqual(1);
        expect(app.textValue.boundedElem[0].getAttribute('lil-bind-from')).toEqual('value');
      });

      it('should add a function to the element\'s oninput event', () => {
        setUp(goodText);
        const elem = document.querySelector('#app');
        const app = liljs(elem, {});
        expect(typeof app.textValue.boundedElem[0].oninput).toEqual('function');
      });

      it('should NOT render the element if the new value is the same', () => {
        setUp(goodText);
        const elem = document.querySelector('#app');
        const app = liljs(elem, {});
        spyOn(app.textValue, 'render').and.callThrough();
        app.textValue = '123';
        app.textValue.boundedElem[0].oninput({
          target: app.textValue.boundedElem[0],
        });
        expect(app.textValue.render).not.toHaveBeenCalled();
      });

      it('should render the element if the new value is different', () => {
        setUp(goodText);
        const elem = document.querySelector('#app');
        const app = liljs(elem, {});
        spyOn(app.textValue, 'render').and.callThrough();
        app.textValue = '123';
        app.textValue.boundedElem[0].value = '567';
        app.textValue.boundedElem[0].oninput({
          target: app.textValue.boundedElem[0],
        });
        expect(app.textValue.render).toHaveBeenCalled();
        expect(app.textValue.value).toEqual('567');
      });

      afterEach(() => {
        document.body.innerHTML = '';
      });
    });
  });
});
