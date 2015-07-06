import Ember from 'ember';
import MagicArrayMixin from '../mixins/magic-array';
import OcclusionCollectionMixin from '../mixins/occlusion-collection';
import VerticalOptsMixin from '../mixins/vertical-opts';

const {
  get: get,
  Component
  } = Ember;

export default Component.extend(MagicArrayMixin, VerticalOptsMixin, OcclusionCollectionMixin, {

  /**!
   * Defaults to `div`.
   *
   * If itemTagName is blank or null, the `occlusion-collection` will [tag match](../addon/utils/get-tag-descendant.js)
   * with the `OcclusionItem`.
   */
  tagName: 'occlusion-collection',


  //–––––––––––––– Performance Tuning


  _getChildren: function() {
    var eachList = Ember.A(this._childViews[0]);
    var childViews = [];
    eachList.forEach(function(virtualView){
      childViews.push(virtualView._childViews[0]);
    });
    return childViews;
  },
  childForItem: function(item) {
    var val = get(item, this.get('keyForId'));
    return this.get('_children')[val];
  },

  //–––––––––––––– Setup/Teardown

  _reflectContentChanges: function() {

    var content = this.get('__content');
    var self = this;

    content.contentArrayDidChange = function handleArrayChange(items, offset, removeCount, addCount) {

      if (offset <= self.get('_firstVisibleIndex')) {
        self.__prependComponents(addCount);
      } else {
        self._taskrunner.schedule('render', self, self._updateChildStates);
      }

    };

  },


  init: function() {
    this._super();
    this._reflectContentChanges();
  }


});
