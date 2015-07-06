import Ember from 'ember';

export default Ember.Route.extend({

  model: function() {
    var items = [];
    for (var i = 1; i <= 10000; i++) {
      items.push({ id: i });
    }
    return items;
  }

});
