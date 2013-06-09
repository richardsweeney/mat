;(function( $ ) {

    "use strict"


    // Nicer syntax for underscore: more like mustache
    _.templateSettings = {
        evaluate    : /<#([\s\S]+?)#>/g,
        escape      : /\{\{([^\}]+?)\}\}(?!\})/g,
        interpolate : /\{\{([\s\S]+?)\}\}/g
    }


    Backbone.pubSub = _.extend( {}, Backbone.Events )


    var ResultModel = Backbone.Model.extend({
        urlRoot: 'http://matapi.se/foodstuff/'
    })


    var ResultView = Backbone.View.extend({

        el: $( '#foodstuff-container' ),

        initialize: function() {
            this.listenTo( this.model, 'change', this.render );
            this.model.fetch()
            Backbone.pubSub.on( 'resultIn', this.emptyResults, this )
        },

        render: function() {
            Backbone.pubSub.trigger( 'resultIn' )

            var template = _.template( $( '#foodstuff-template' ).html(), this.model.toJSON() )
            this.$el.html( template )
        },

        emptyResults: function() {
            this.$el.empty()
        }

    })


    var Search = Backbone.Model.extend()

    var SearchCollection = Backbone.Collection.extend({

        model: Search,

        initialize: function( query ) {
            this.query = query.query
        },

        url: function() {
            return 'http://matapi.se/foodstuff/?query=' + this.query
        }

    })


    var SearchView = Backbone.View.extend({

        el: $( '#results-container' ),

        initialize: function( query ) {
            this.collection = new SearchCollection( query )
            this.collection.bind( 'reset', this.render, this )
            this.collection.fetch({ reset: true })
            Backbone.pubSub.on( 'resultIn', this.emptyResults, this )
        },

        render: function() {
            Backbone.pubSub.trigger( 'searchResultsIn' )

            var list = $( '<ul />' ),
                items = ''

            _.each( this.collection.models, function( model ) {
                items += _.template( $( '#result-template' ).html(), model.toJSON() )
            }, this )

            list.append( items )
            this.$el.html( list )
        },

        events: {
            'click a' : 'getFoodStuff'
        },

        emptyResults: function() {
            this.$el.empty()
        },

        getFoodStuff: function( e ) {
            e.preventDefault()
            var id = e.target.id

            appRoutes.navigate( '/id=' + id, { trigger: true } )

        }

    })





    var AppView = Backbone.View.extend({

        el: $( '#search-container' ),

        initialize: function() {
            this.render()

            var location = window.location.href.split( '?' )
            location = location[1].split( '=' )

            switch ( location[0] ) {

                case 'id' :
                    appRoutes.navigate( '/?id=' + location[1], { trigger: true } )
                    break

                case 'search' :
                    appRoutes.navigate( '/?search=' + loaction[1], { trigger: true } )
                    break

            }

        },

        render: function() {
            var template = _.template( $( '#search-template' ).html(), {} )
            this.$el.html( template )
        },

        events: {
            'click button' : 'search'
        },

        search: function( e ) {
            e.preventDefault()

            var query = encodeURI( $( '#search' ).val() )

            appRoutes.navigate( '/?search=' + query, { trigger: true } )

        }

    })

    var AppRoutes = Backbone.Router.extend({

        initialize: function() {
            var appView = new AppView
        },

        routes: {
            '?search=:query': 'searchFoodstuffs',
            '?id=:id': 'getFoodstuff'
        },

        searchFoodstuffs: function( query ) {
            var searchView = new SearchView({ query: query })
        },

        getFoodstuff: function( id ) {
            var resultModel = new ResultModel({ id: id }),
                resultView = new ResultView({ model: resultModel })
        }

    })

    var appRoutes = new AppRoutes

    Backbone.history.start({ pushState: true })


}( Zepto ))
