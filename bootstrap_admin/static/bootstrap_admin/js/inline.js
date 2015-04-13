(function($) {
  $.fn.stackedFormset = function(options) {
  	var $rows = $(this);
  
  	var update_inline_labels = function(formset_to_update) {
  		formset_to_update.children('.inline-related').not('.empty-form').children('h3').find('.inline_label').each(function(i) {
  			var count = i + 1;
  			$(this).html($(this).html().replace(/(#\d+)/g, "#" + count));
  		});
  	};
  
  	var reinitDateTimeShortCuts = function() {
  		// Reinitialize the calendar and clock widgets by force, yuck.
  		if ( typeof DateTimeShortcuts != "undefined") {
  			$(".datetimeshortcuts").remove();
  			DateTimeShortcuts.init();
  		}
  	};
  
  	var updateSelectFilter = function() {
  		// If any SelectFilter widgets were added, instantiate a new instance.
  		if ( typeof SelectFilter != "undefined") {
  			$(".selectfilter").each(function(index, value) {
  				var namearr = value.name.split('-');
  				SelectFilter.init(value.id, namearr[namearr.length - 1], false, options.adminStaticPrefix);
  			});
  			$(".selectfilterstacked").each(function(index, value) {
  				var namearr = value.name.split('-');
  				SelectFilter.init(value.id, namearr[namearr.length - 1], true, options.adminStaticPrefix);
  			});
  		}
  	};
  
  	var initPrepopulatedFields = function(row) {
  		row.find('.prepopulated_field').each(function() {
  			var field = $(this), input = field.find('input, select, textarea'), dependency_list = input.data('dependency_list') || [], dependencies = [];
  			$.each(dependency_list, function(i, field_name) {
  				dependencies.push('#' + row.find('.form-row .field-' + field_name).find('input, select, textarea').attr('id'));
  			});
  			if (dependencies.length) {
  				input.prepopulate(dependencies, input.attr('maxlength'));
  			}
  		});
  	};
  
  	$rows.formset({
  		prefix : options.prefix,
  		addText : options.addText,
  		formCssClass : "dynamic-" + options.prefix,
  		deleteCssClass : "inline-deletelink",
  		deleteText : options.deleteText,
  		emptyCssClass : "empty-form",
  		removed : function(row) {
  			update_inline_labels(row);
  			if(options.removed) options.removed(row);
  		},
  		added : (function(row) {
  			initPrepopulatedFields(row);
  			reinitDateTimeShortCuts();
  			updateSelectFilter();
  			update_inline_labels(row.parent());
  			if(options.added) options.added(row);
  		})
  	});
  
  	return $rows;
  };
  
  $.fn.tabularFormset = function(options) {
  	var $rows = $(this);
  	var alternatingRows = function(row) {
  		row_number = 0;
  		$($rows.selector).not(".add-row").removeClass("row1 row2").each(function() {
  			$(this).addClass('row' + ((row_number%2)+1));
  			row_number = row_number + 1;
  		});
  	};
  
  	var reinitDateTimeShortCuts = function() {
  		// Reinitialize the calendar and clock widgets by force
  		if ( typeof DateTimeShortcuts != "undefined") {
  			$(".datetimeshortcuts").remove();
  			DateTimeShortcuts.init();
  		}
  	};
  
  	var updateSelectFilter = function() {
  		// If any SelectFilter widgets are a part of the new form,
  		// instantiate a new SelectFilter instance for it.
  		if ( typeof SelectFilter != 'undefined') {
  			$('.selectfilter').each(function(index, value) {
  				var namearr = value.name.split('-');
  				SelectFilter.init(value.id, namearr[namearr.length - 1], false, options.adminStaticPrefix);
  			});
  			$('.selectfilterstacked').each(function(index, value) {
  				var namearr = value.name.split('-');
  				SelectFilter.init(value.id, namearr[namearr.length - 1], true, options.adminStaticPrefix);
  			});
  		}
  	};
  
  	var initPrepopulatedFields = function(row) {
  		row.find('.prepopulated_field').each(function() {
  			var field = $(this), input = field.find('input, select, textarea'), dependency_list = input.data('dependency_list') || [], dependencies = [];
  			$.each(dependency_list, function(i, field_name) {
  				dependencies.push('#' + row.find('.field-' + field_name).find('input, select, textarea').attr('id'));
  			});
  			if (dependencies.length) {
  				input.prepopulate(dependencies, input.attr('maxlength'));
  			}
  		});
  	};
  
  	$rows.formset({
  		prefix : options.prefix,
  		addText : options.addText,
  		formCssClass : "dynamic-" + options.prefix,
  		deleteCssClass : "inline-deletelink",
  		deleteText : options.deleteText,
  		emptyCssClass : "empty-form",
  		removed : function(row) {
  			alternatingRows(row);
  			if(options.removed) options.removed(row);
  		},
  		added : function(row) {
  			initPrepopulatedFields(row);
  			reinitDateTimeShortCuts();
  			updateSelectFilter();
  			alternatingRows(row);
  			if(options.added) options.added(row);
  		}
  	});
  
  	return $rows;
  };
})(django.jQuery); 
