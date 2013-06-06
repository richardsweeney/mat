;(function( $ ) {

    "use strict"

    var Search = Backbone.Model.extend()

    var SearchCollection = Backbone.Collection.extend({

        model: Search,

        initialize: function( options ) {
            this.query = options.query
            var resultsView = new ResultsView()
        },

        url: function() {
            return 'http://matapi.se/foodstuff/?query=' + this.query
        }

    })


    var ResultsView = Backbone.View.extend({

        tagName: 'ul',

        collection: SearchCollection,

        el: $( '#results-container' ),

        initialize: function() {
            this.render()
        },

        render: function() {
            this.$el.empty()
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

            var term = encodeURI( $( '#search' ).val() ),
                searchCollection = new SearchCollection({ query: term }),
                result = searchCollection.fetch()

        }

    })

    $( function() {

        var searchView = new SearchView

        // console.log( searchView )

    })


}( Zepto ))
