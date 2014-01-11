
// A section object has a name, (optional description), a content array, and a locked attribute.
// These attributes are accessible through the section model's getters and setters
var Section = Backbone.Model.extend({
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
  tagName: "section",
  events: {
    'click a.complete': this.complete
  },
  complete: function(){

    this.model.complete();
  },
  //currently just expecting images of various sizes
  template: _.template( "<% _.each(content, function(img) { %><div class = 'contentSection'> <img src = '<%= img %>'></div><% }); %>"),
  render: function(){
    this.$el.append(this.template(this.model.attributes));
    if (this.model.get('locked')) this.$el.addClass('locked');
  }
});

var Sections = Backbone.Collection.extend({
});

var SectionsView = Backbone.View.extend({
  initialize: function(){
    this.render();
  },
  className: 'main',
  render: function(){
    var prev;
    this.collection.forEach(function(model){
      // Making sections into a quasi linked list (because they'll want to communicate)
      if (!prev) this.collection.head  =  model;
      else {
        prev.set('next', model);
        model.set('prev', prev);
      }
      prev = model;
      //creating views for sections
      this.$el.append(new SectionView({model: model}).el);
    }, this);
    this.collection.tail = this.collection.at(this.collection.length - 1);
    //TODO Completion
    // this.get('tail').set('next', new Done());
  }
});

var MenuView = Backbone.View.extend({
  events: {
  },
  tagName: 'ul',
  initialize: function(){
    this.showing = true;
    this.render();
  },
  template: _.template('<li><a href = "#<%= name %>"><%= name %></a></li>'),
  render: function(){
    this.collection.forEach(function(model){
      this.$el.append(this.template(model.attributes));
    }, this);
  },
  toggle: function(){
    if (this.showing) this.$el.hide();
    else this.$el.show();
    this.showing = !this.showing;
  }
});

var HeaderView = Backbone.View.extend({
  events: {
    'click a.sections': 'toggleSectionMenu'
  },
  tagName: 'ul',
  initialize: function(){
    this.render();
  },
  render: function(){
    this.$el.append('<a class = "sections" href = "#">Sections </a> <a class = "home" href = "#"> Home</a>');
  },
  toggleSectionMenu: function(){
    this.sectionMenu.toggle();
  }
});

// var App = Backbone.Model.extend({
//   initialize: function(){
//     this.on('toggleMenu', function(){
//       this.menuView.toggle();
//     }, this);
//   }
// });

// var app = new App();

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
  $(document).ready(function(){
    $('body').append(sectionsView.el);
    $('#header').append(new HeaderView(menuView).el);
    $('#navigation').append(menuView.el);
    //setting up the menu
    $(".main").onepage_scroll({
       sectionContainer: "section", // sectionContainer accepts any kind of selector in case you don't want to use section
       easing: "ease", // Easing options accepts the CSS3 easing animation such "ease", "linear", "ease-in", "ease-out", "ease-in-out", or even cubic bezier value such as "cubic-bezier(0.175, 0.885, 0.420, 1.310)"
       animationTime: 1000, // AnimationTime let you define how long each section takes to animate
       pagination: false, // You can either show or hide the pagination. Toggle true for show, false for hide.
       updateURL: false, // Toggle this true if you want the URL to be updated automatically when the user scroll to each page.
       beforeMove: function(index) {}, // This option accepts a callback function. The function will be called before the page moves.
       afterMove: function(index) {}, // This option accepts a callback function. The function will be called after the page moves.
       loop: false, // You can have the page loop back to the top/bottom when the user navigates at up/down on the first/last page.
       responsiveFallback: false // You can fallback to normal page scroll by defining the width of the browser in which you want the responsive fallback to be triggered. For example, set this to 600 and whenever the browser's width is less than 600, the fallback will kick in.
    });
  });
});

// var Router = Backbone.Router.extend({});
