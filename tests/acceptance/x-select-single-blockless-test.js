/*global expect */
/* jshint expr:true */

import Ember from 'ember';
import startApp from '../helpers/start-app';
import { it } from 'ember-mocha';
import { beforeEach, afterEach, describe } from '../test-helper';
import { bastion, stanley, charles } from 'dummy/mixins/folks';

var App;

describe('XSelect: Single Selection Blockless', function() {
  var select, controller;
  beforeEach(function() {
    App = startApp();
    visit("/blockless-single");
  });
  beforeEach(function() {
    var el = Ember.$('select');
    select = App.__container__.lookup('-view-registry:main')[el.attr('id')];
    this.$ = function() {
      return select.$.apply(select, arguments);
    };
    controller = App.__container__.lookup('controller:blocklessSingle');
  });

  afterEach(function() {
    Ember.run(App, 'destroy');
  });

  it("does not fire any actions on didInsertElement", function() {
    expect(controller.get('tagged')).not.to.be.ok;
  });

  it('is enabled by default', function() {
    expect(this.$()).not.to.be.disabled;
  });

  it('renders the first option for placeholder', function() {
    expect(this.$('option').length).to.equal(4);
    expect(this.$('option:first')).to.have.text('choose one');
  });

  it('renders an option for each view', function() {
    expect(this.$('option').length).to.equal(4);
    expect(this.$('option:eq(1)')).to.have.text('Bastion');
    expect(this.$('option:last')).to.have.text('Charles');
  });

  it('placeholder is the default selected option', function() {
    expect(this.$('option:eq(1)')).to.be.selected;
  });

  describe('choosing the last option', function() {
    beforeEach(function() {
      this.$().prop('selectedIndex', 3).trigger('change');
    });

    it('invokes action', function() {
      expect(controller.get('tagged')).to.equal(charles);
    });
  });

  describe('manually setting the selected binding', function() {
    beforeEach(function() {
      controller.set('it', controller.get('charles'));
    });
    it('updates the selected option', function() {
      expect(this.$('option:eq(3)')).to.be.selected;
    });
  });

  describe('disabling', function() {
    beforeEach(function() {
      controller.set('isDisabled', true);
    });
    it('disables the select box', function() {
      expect(this.$()).not.to.be.enabled;
    });
  });

  describe("when no option is selected", function() {
    beforeEach(function() {
      this.$().prop('selectedIndex', 4).trigger('change');
    });
    it("has no value", function() {
      expect(controller.get('tagged')).to.equal(undefined);
    });
  });

});
