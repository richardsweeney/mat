;(function( $ ) {

    "use strict"

    var query

    var Search = Backbone.Model.extend({

        initialize: function() {
            // console.log( this )
        }

    })

    var SearchCollection = Backbone.Collection.extend({

        model: Search,

        initialize: function( query ) {
            this.query = query.query
        },

        url: function() {
            return 'http://matapi.se/foodstuff/?query=' + this.query
        }

    })


    var ResultsView = Backbone.View.extend({

        tagName: 'ul',

        el: $( '#results-container' ),

        initialize: function( query ) {
            this.collection = new SearchCollection( query )
            this.collection.bind( 'reset', this.render, this )
            this.collection.fetch({ reset: true })
        },

        render: function() {
            var template = ''
            _(this.collection.models).each( function( model ) {
                template += _.template( $( '#result-template' ).html(), model.attributes )
            }, this )
            this.$el.html( template )
        }

    })


    var SearchView = Backbone.View.extend({

        el: $( '#search-container' ),

        initialize: function() {
            this.render()
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

            var
                query       = encodeURI( $( '#search' ).val() ),
                resultsView = new ResultsView({ query: query })
                // searchCollection = new SearchCollection({ query: query }),
                // resultsView      = new ResultsView({ collection: searchCollection })


        }

    })

    $( function() {

        var searchView = new SearchView

        // console.log( searchView )

    })


}( Zepto ))
