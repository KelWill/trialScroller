//  This would be changed with a custom url based on the course
var fb = new Firebase('https://versaltrial.firebaseio.com/demo');
//  as soon as data has been loaded generate models and views
fb.once('value', function(snapshot){
  var sections = new Sections(snapshot.val());
  console.log(sections);
  var menuView = new MenuView({collection: sections});
  var sectionsView = new SectionsView({collection: sections});
});

// A section object has a name, (optional description), a content array, and a locked attribute
// These attributes are accessible through the section model's getters and setters
var Section = Backbone.Model.extend({
});
var Sections = Backbone.Collection.extend({
  model: Section
});

var SectionsView = Backbone.View.extend({
  initialize: function(){
    this.render();
  },
  render: function(){
    this.collection.forEach(function(model){
      this.$el.append(new SectionView({model: model}));
    });
  }
});

var MenuView = Backbone.View.extend({
  events: {
  },
  initialize: function(){
    this.render();
  },
  template: _.template('<li><a href = "#<%= name %>"><%= name %></a></li>'),
  render: function(){
    this.$el = $('#navigation');
    for (var link in links){
      this.$el.append(this.template(this.model.attributes));
    }
  }
});


// var Router = Backbone.Router.extend({});
