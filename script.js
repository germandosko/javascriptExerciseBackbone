var Models = {
	Product: Backbone.Model.extend(),
};

var Collections = {
	Products: Backbone.Collection.extend({
		model: Models.Product,
		url: 'https://openapi.etsy.com/v2/listings/active.js?api_key=5ek4vq6nbjpzsyisap0n8woc&includes=Images:1&limit=20&page=1&sort_on=created&sort_order=up',
		parse: function(resp) {
			return resp;
		}
	}),
};

var Views = {
	SingleProduct: Backbone.View.extend({
		className: 'product',
		initialize: function(){
			this.template = _.template($('#single_product_template').val());
		},
		render: function(){
			this.$el.html(this.template({video:this.model.toJSON()}));
			return this;
		},
	}),
	
	ProductApp: Backbone.View.extend({
		initialize: function() {
			_.bindAll(this);
			this.collection = new Collections.Products();
			this.collection.on('reset', this.showProducts, this);
		},
		render: function() {
			this.showProducts();
			return this;
		},
		showProducts: function() {
			this.$el.find('#results').empty();
			var p = null;
			this.collection.each(function(item, idx) {
				p = new Views.SingleProduct({model:item});
				this.$el.find('#results').append(v.render().el);
			}, this);
			return this;
		},		
	}),
};


$(document).ready(function() {
	var pr = new Views.ProductApp();
	pr.setElement($('#results')).render();
});
