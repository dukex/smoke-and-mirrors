import Ember from 'ember';
import OcclusionCollectionMixin from '../mixins/occlusion-collection';
import VerticalOptsMixin from '../mixins/vertical-opts';
import MagicArrayMixin from '../mixins/magic-array';

const {
  get: get,
  Component,
  computed
} = Ember;

export default Component.extend(MagicArrayMixin, VerticalOptsMixin, OcclusionCollectionMixin, {

  /**!
   * Defaults to `div`.
   *
   * If itemTagName is blank or null, the `occlusion-collection` will [tag match](../addon/utils/get-tag-descendant.js)
   * with the `OcclusionItem`.
   */
  tagName: 'occlusion-collection',

  _children: null,
  _getChildren: function() {
    return this.get('_children');
  },
  childForItem: function(item) {
    var val = get(item, this.get('keyForId'));
    return this.get('_children')[val];
  },
  register: function(child, key) {
    this.get('_children')[key] = child;
  },
  unregister: function(key) {
    this.get('_children')[key] = null; // don't delete, it leads to too much GC
  },

  didReceiveAttrs: function(attrs) {
    var oldArray = attrs.oldAttrs && attrs.oldAttrs.content ? attrs.oldAttrs.content.value : false;
    var newArray = attrs.newAttrs && attrs.newAttrs.content ? attrs.newAttrs.content.value : false;
    if (oldArray && newArray && this._changeIsPrepend(oldArray, newArray)) {
      var addCount = get(newArray, 'length') - get(oldArray, 'length');
      this.__prependComponents(addCount);
    } else {
      this._taskrunner.schedule('actions', this, this._updateChildStates);
    }
  },

  _changeIsPrepend: function(oldArray, newArray) {

    var lengthDifference = get(newArray, 'length') - get(oldArray, 'length');
    var key = this.get('keyForId');

    // if either array is empty or the new array is not longer, do not treat as prepend
    if (!get(newArray, 'length') || !get(oldArray, 'length') || lengthDifference <= 0) {
      return false;
    }

    // if the keys at the correct indexes are the same, this is a prepend
    var oldInitialItem = oldArray.objectAt ? get(oldArray.objectAt(0), key) : get(oldArray[0], key);
    var newInitialItem = newArray.objectAt ? get(newArray.objectAt(lengthDifference), key) : get(newArray[lengthDifference], key);

    return oldInitialItem === newInitialItem;
  },

  init: function() {
    this._super();
    this.set('_children', {});
  }


});
