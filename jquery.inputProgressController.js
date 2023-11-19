/*
* form progress, jQuery plugin
* jquery3.6.0
*/
(function($) {

  $.fn.inputProgressController = function(method) {
    if ( methods[method] ) {
      return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
    } else if ( typeof method === 'object' || ! method ) {
      return methods.init.apply( this, arguments );
    } else {
      $.error( 'Method ' + method + ' does not exist on jQuery.inputProgressController' );
    }
  };  
  // default option
	$.inputProgressController= { defaults:{
    fieldClass: "js-input-field",
    fieldOkClass: "js-input-field--ok",
    fieldErrorClass: "js-input-field--error",
    progressBarClass: "js-step-progress-bar",
    progressValueClass: "js-step-progress-value",
    fieldOkColor:"#fff",
    fieldErrorColor:"#FFEBEE",    
  }};

  const methods = {

    // setting marge
    // @param:form
    _saveOptions : function(form,option){
      var options = $.extend(true, {
        form: form,
      },$.inputProgressController.defaults, option);
      form.data('ipc', options);
      return options;

    },
    // start up
    // @param:option
    init : function( option ) {
      var form = this;
      //options setting
      var options = methods._saveOptions(this,option);

      //field event trigger
      form.on('blur keydown keyup keypress change onchange', '[class*='+options.fieldClass+']',{"delay": 300}, function(event) {
        methods.inputFieldEvent.call(this, event, form);
      });

      methods.formValidateRun(form);      
    
    },
    //field event
    // @param:event,form
    inputFieldEvent : function(event,form){
      
      var options = form.data('ipc');
      var field = event.target;   

      // group bg reset      
      switch ($(field).prop("type")) {
        case "radio":
        case "checkbox":
          form.find('[name='+$(field).attr("name")+']').each(function(index,btn) {
            $(btn).css('background-color','#fff');
          });
          break;    
        default:    
          break;
      }      
      methods.fieldValidation(field,form);
      methods.progressUpdate(form);
    },
    // field validate
    // @param:field,form
    // manualValidate: bool
    fieldValidation: function(field,form,manualValidate = null){
      
      var isField = methods._convertElementVanilla(field);
      var options = form.data('ipc');
      var isValidate = methods._checkRequired(isField,options);

      // manualValidation or required
      if(manualValidate != null){
        isValidate = manualValidate;
      }else{
        isValidate = methods._checkRequired(isField,options);
      }      

      //OK
      if(isValidate){
        $(field).addClass(options.fieldOkClass);
        $(field).removeClass(options.fieldErrorClass);
        $(field).css('background-color',options.fieldOkColor);        
      //NG
      }else{
        $(field).addClass(options.fieldErrorClass);
        $(field).removeClass(options.fieldOkClass);          
        $(field).css('background-color',options.fieldErrorColor);
      }

    },
    // rate Controll
    // @return:rate
    _rateConversion :function(ratio,whole,max=100){
      if (whole < 1) return 0;
      rate = Math.floor(ratio / whole * 100);
      rate = rate < 0 ? 0 : rate > max ? max : rate;
      return rate;
    },    
    // counting ok field @return:fields that passed validation
    // @param:options
    _fieldValidateOkCounter :function(options){

      var getOkField = options.form.find('[class*='+options.fieldOkClass+']').not(":disabled");
			var ok = $(getOkField).filter( function( index,field ) {		
        switch ($(field).prop("type")) {
          case "radio":
          case "checkbox":
            if ($(field).prop('checked')) {
              return field;
            }            
            break;
          default:
            return field;
            break;
        }							
			});	
      return ok.length;

    },
    // counting field @return: field for progress management
    // @param:options
    _fieldCounter : function( options ) {
      
      var getField = options.form.find('[class*='+options.fieldClass+']').not(":disabled");
			var counterField = $(getField).filter( function( index,field ) {									
				  return field;
			});	
      var countdiv = [];
			counterField.filter( function( index,field ) {				
				var tmpName = $(field).attr("name");
				if(tmpName == undefined || tmpName == null ){
					Object.assign(countdiv, {["count"+index]: field});
				}else{
					Object.assign(countdiv, {[tmpName]: field});
				}
			}); 
			return Object.keys(countdiv).length;      

    },
    // vaidate: required
    // @param:field,options
    // @return bool
    _checkRequired: function(field,options){
      result = false;

      switch ($(field).prop("type")) {
        case "radio":
        case "checkbox":          
          if ($(field).prop('checked')) {
            result = true;
          }else{
            checkField = $(options.form).find('[name='+$(field).attr("name")+']').filter( function( index,group ) {	
              if($(group).prop('checked')) {
                return group;
              }
            });                         
            if(checkField.length){
              result = true;
            }else{
              result =false;
            }
          }
          break;
        default:
          if ($(field).val().length) 
            result = true;
          else
            result = false;                 
          break;        
      }

      return result;
      
    },

    // element vanilla conversion
    // @param:element
    // @return element : vanilla 
    _convertElementVanilla: function (element) {
      if (element instanceof jQuery) {
          return element.get(0);
      } else {
          return element;
      }
    },

    // trigger event

    // trigger: progress update(not validate)
    // @param:form
    progressUpdate : function(form=this){  
      var options = form.data('ipc');
      setTimeout(function(){
        fieldCount = methods._fieldCounter(options);
        okCount = methods._fieldValidateOkCounter(options);
        rate = methods._rateConversion(okCount,fieldCount);
        form.find('[class*='+options.progressValueClass+']').html(rate);
        form.find('[class*='+options.progressBarClass+']').css('width',rate+'%');
      },500);
    },
    // trigger: all validate event & progress update
    // @param:form
    formValidateRun: function(form=this){
      var options = form.data('ipc');
      fields = form.find('[class*='+options.fieldClass+']').not(":disabled");
      $(fields).each(function(index,field) {
        methods.fieldValidation(field,form);
      });
      methods.progressUpdate(form);
    },      
  };  

})(jQuery);