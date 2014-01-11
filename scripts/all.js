
// A section object has a name, (optional description), a content array, and a locked attribute.
// These attributes are accessible through the section model's getters and setters
var Section = Backbone.Model.extend({
  initialize: function(){
    console.log('things are being initialized');
  },
  complete: function(){
    this.get('next').unlock();
  },
  unlock: function(){
    this.set('locked', false);
  }
});
var SectionView = Backbone.View.extend({
  initialize: function(){
    this.model.on('unlock', this.render);
    this.render();
  },
  className: "row",
  events: {
    'click a.complete': this.complete
  },
  complete: function(){
    this.model.complete();
  },
  //currently just expecting images of various sizes
  template: _.template( "<% _.each(content, function(img) { %><div class = 'contentSection'> <img src = '<%= img %>'></div><% }); %>"),
  render: function(){
    if (this.model.get('locked')){
      //TODO create better locked screen, use really opaque fuzzing
      this.$el.append('<div class = "locked">LOCKED!</div>');
    } else {
      this.$el.append(this.template(this.model.attributes));
    }
  }
});

var Sections = Backbone.Collection.extend({
});

var SectionsView = Backbone.View.extend({
  initialize: function(){
    this.render();
  },
  render: function(){
    var prev;
    this.collection.forEach(function(model){
      // Making sections into a quasi linked list (because they'll want to communicate)
      if (!prev) this.collection.set('head', model);
      else {
        prev.set('next', model);
        model.set('prev', prev);
      }
      prev = model;
      //creating views for sections
      this.$el.append(new SectionView({model: model}).el);
    }, this);
    this.collection.set('tail', this.collection.at(this.collection.length - 1));
    //TODO Completion
    // this.get('tail').set('next', new Done());
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
    this.collection.forEach(function(model){
      this.$el.append(this.template(model.attributes));
    }, this);
  }
});

// // This doesn't actually need any special stuff on the model
// var AllView = Backbone.View.extend(new Backbone.Model);

//  This would be changed with a custom url based on the course
var fb = new Firebase('https://versaltrial.firebaseio.com/demo');
//  as soon as data has been loaded generate models and views
fb.once('value', function(snapshot){
  //Generating collections, models, and views
  var sections = new Sections();
  //Backbone likes arrays rather than objects--this could be cleaned up slightly
  _.each(snapshot.val(), function(value){
    sections.add(new Section(value));
  });
  var menuView = new MenuView({collection: sections});
  var sectionsView = new SectionsView({collection: sections});
  //Adding to DOM
  $('.content').append(sectionsView.el);
  $('#navigation').append(menuView.el);
});

// var Router = Backbone.Router.extend({});
