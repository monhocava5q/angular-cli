import {
  it,
  iit,
  describe,
  ddescribe,
  expect,
  inject,
  injectAsync,
  TestComponentBuilder,
  beforeEachProviders
} from 'angular2/testing';
import {bind} from 'angular2/core';
import {<%= classifiedModuleName %>ListComponent} from './<%= dasherizedModuleName %>-list.component';
import {<%= classifiedModuleName %>, <%= classifiedModuleName %>Service} from './<%= dasherizedModuleName %>.service';

class Mock<%= classifiedModuleName %>Service {
  getAll() { return Promise.resolve([new <%= classifiedModuleName %>(1, 'one')]); }
}

describe('<%= classifiedModuleName %>ListComponent', () => {

  beforeEachProviders(() => [
    bind(<%= classifiedModuleName %>Service).toValue(new Mock<%= classifiedModuleName %>Service()),
  ]);

  it('should ...', injectAsync([TestComponentBuilder], (tcb:TestComponentBuilder) => {
    return tcb.createAsync(<%= classifiedModuleName %>ListComponent).then((fixture) => {
      fixture.detectChanges();
    });
  }));

});
