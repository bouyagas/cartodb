var _ = require('underscore');
var cdb = require('cartodb.js');
var ViewFactory = require('../../common/view_factory');
var pluralizeStr = require('../../common/view_helpers/pluralize_string');

/**
 * View of a single group user.
 */
module.exports = cdb.core.View.extend({

  tagName: 'li',
  className: 'OrganizationList-user is-selectable',
  events: {
    'click': '_onClick'
  },

  initialize: function() {
    _.each(['model'], function(name) {
      if (!this.options[name]) throw new Error(name + ' is required');
    }, this);
    this._initBinds();
  },

  render: function() {
    this.$el.html(
      this.getTemplate('organization/groups_admin/group_user')({
        avatarUrl: this.model.get('avatar_url'),
        username: this.model.get('username'),
        email: this.model.get('email'),
        xMaps: pluralizeStr.prefixWithCount('map', 'maps', this.model.get('all_visualization_count')),
        xDatasets: pluralizeStr.prefixWithCount('dataset', 'datasets', this.model.get('table_count'))
      })
    );
    return this;
  },

  _initBinds: function() {
    this.model.on('change:selected', this._onChangeSelected, this)
  },

  _onChangeSelected: function(m, isSelected) {
    this.$el.toggleClass('is-selected', !!isSelected);
  },

  _onClick: function(ev) {
    this.killEvent(ev);
    this.model.set('selected', !this.model.get('selected'));
  }

});
