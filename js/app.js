;(function( $ ) {

    // "use-strict"

    var Search = Backbone.Model.extend({

        initialize: function() {
            console.log( this )
        }

    })


    var SearchCollection = Backbone.Collection.extend({

        model: Search,
        initialize: function( options ) {
            this.query = options.query
        },
        url: function() {
            return 'http://matapi.se/foodstuff/?query=' + this.query
        }

    })


    var ResultsView = Backbone.View.extend({

        initialize: function() {
            this.render()
        },
        render: function() {
            var template = _.template( $( '#result-template' ).html(), {} )
            this.$el.html( template )
        }

    })


    var SearchView = Backbone.View.extend({

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
                collection = new SearchCollection({ query: term }),
                result

            result = collection.fetch()

            console.log( result )
        }

    })

    $(function() {

        var searchView = new SearchView({ el: $( '#search-container' ) })

        // console.log( searchView )

    })


}( Zepto ))
