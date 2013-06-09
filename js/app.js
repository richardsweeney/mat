;(function( $ ) {

    "use strict"


    // Nicer syntax for underscore: more like mustache
    _.templateSettings = {
        evaluate    : /<#([\s\S]+?)#>/g,
        escape      : /\{\{([^\}]+?)\}\}(?!\})/g,
        interpolate : /\{\{([\s\S]+?)\}\}/g
    }

    Backbone.pubSub = _.extend( {}, Backbone.Events )


    var AppRoutes = Backbone.Router.extend({

        initialize: function() {
            var appView = new Views.App
            Backbone.history.start({ pushState: true })
        },

        routes: {
            'search/:query': 'searchFoodstuffs',
            'foodstuff/:id': 'getFoodstuff'
        },

        searchFoodstuffs: function( query ) {
            var searchView = new Views.Search({ query: query })

        },

        getFoodstuff: function( id ) {
            var resultModel = new Models.FoodStuff({ id: id }),
                resultView = new Views.FoodStuff({ model: resultModel })
        }

    })


    var Views = {

        App: Backbone.View.extend({

            el: $( '#search-container' ),

            initialize: function() {
                this.render()
            },

            render: function() {
                var template = _.template( $( '#search-template' ).html(), {} )
                this.$el.html( template )
            },

            events: {
                'submit form' : 'search'
            },

            search: function( e ) {
                e.preventDefault()
                $( '#container' ).addClass( 'loading' )

                var query = encodeURI( $( '#search' ).val() )

                appRoutes.navigate( '/search/' + query, { trigger: true } )

            }

        }),

        FoodStuff: Backbone.View.extend({

            el: $( '#foodstuff-container' ),

            initialize: function() {
                this.listenTo( this.model, 'change', this.render );
                this.model.fetch()
                Backbone.pubSub.on( 'searchResultsIn', this.emptyView, this )
            },

            render: function() {
                Backbone.pubSub.trigger( 'resultIn' )

                var template = _.template( $( '#foodstuff-template' ).html(), this.model.toJSON() )
                this.$el.html( template )

                $( '#container' ).removeClass( 'loading' )
            },

            emptyView: function() {
                this.$el.empty()
            }

        }),

        Search: Backbone.View.extend({

            el: $( '#results-container' ),

            initialize: function( query ) {
                this.collection = new Collections.Search( query )
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

                $( '#container' ).removeClass( 'loading' )
            },

            events: {
                'click a' : 'getFoodStuff'
            },

            emptyResults: function() {
                this.$el.empty()
            },

            getFoodStuff: function( e ) {
                e.preventDefault()
                $( '#container' ).addClass( 'loading' )

                var id = e.target.id

                appRoutes.navigate( '/foodstuff/' + id, { trigger: true } )

            }

        })

    }


    var Models = {

        FoodStuff: Backbone.Model.extend({
            urlRoot: 'http://matapi.se/foodstuff/'
        }),

        Search: Backbone.Model.extend(),

    }


    var Collections = {

        Search: Backbone.Collection.extend({

            model: Models.Search,

            initialize: function( query ) {
                this.query = query.query
            },

            url: function() {
                return 'http://matapi.se/foodstuff/?query=' + this.query
            }

        })

    }


    var appRoutes = new AppRoutes


}( Zepto ))
