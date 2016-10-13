// jQuery Alert Dialogs Plugin
//
// Version 1.1
//
// Cory S.N. LaViska
// A Beautiful Site (http://abeautifulsite.net/)
// 14 May 2009
//
// Visit http://abeautifulsite.net/notebook/87 for more information
//
// Usage:
//		jAlert( message, [title, callback] )
//		jConfirm( message, [title, callback] )
//		jPrompt( message, [value, title, callback] )
//
// History:
//
//		1.00 - Released (29 December 2008)
//
//		1.01 - Fixed bug where unbinding would destroy all resize events
//
// License:
//
// This plugin is dual-licensed under the GNU General Public License and the MIT License and
// is copyright 2008 A Beautiful Site, LLC.
//
(function($) {

	$.alerts = {

		// These properties can be read/written by accessing $.alerts.propertyName from your scripts at any time

		verticalOffset: 0,                // vertical offset of the dialog from center screen, in pixels
		horizontalOffset: 0,                // horizontal offset of the dialog from center screen, in pixels/
		repositionOnResize: true,           // re-centers the dialog on window resize
		overlayOpacity: .2,                // transparency level of overlay
		overlayColor: '#000',               // base color of overlay
		draggable: true,                    // make the dialogs draggable (requires UI Draggables plugin)
		okButton: '是(Y)',         // text for the OK button
		sureButton:'确定',
		cancelButton: '否(N)', // text for the Cancel button
		dialogClass: null,                  // if specified, this class will be applied to all dialogs

		// Public methods

		alert: function(message, title, callback) {
			if( title == null ) title = 'Alert';
			$.alerts._show(title, message, null, 'alert', function(result) {
				if( callback ) callback(result);
			});
		},

		confirm: function(message, title, callback) {
			if( title == null ) title = 'Confirm';
			$.alerts._show(title, message, null, 'confirm', function(result) {
				if( callback ) callback(result);
			});
		},

		prompt: function(message, value, title, callback) {
			if( title == null ) title = 'Prompt';
			$.alerts._show(title, message, value, 'prompt', function(result) {
				if( callback ) callback(result);
			});
		},

		// Private methods

		_show: function(title, msg, value, type, callback) {

			$.alerts._hide();
			$.alerts._overlay('show');

			$("BODY").append(
			  '<div id="popup_container">' +
			    '<h1 id="popup_title"></h1>' +
				  '<span id="popup_close"></span>'+
			    '<div id="popup_content">' +
			      '<div id="popup_message"></div>' +
				'</div>' +
			  '</div>');

			if ($.alerts.dialogClass) $("#popup_container").addClass($.alerts.dialogClass);

			var u = window.navigator.userAgent.toLocaleLowerCase(),
            msie = /(msie) ([\d.]+)/,
            chrome = /(chrome)\/([\d.]+)/,
            firefox = /(firefox)\/([\d.]+)/,
            safari = /(safari)\/([\d.]+)/,
            opera = /(opera)\/([\d.]+)/,
            ie11 = /(trident)\/([\d.]+)/,
            b = u.match(msie) || u.match(chrome) || u.match(firefox) || u.match(safari) || u.match(opera) || u.match(ie11);

			var browserVersion = b[2];


		    // IE6 Fix
			//var userAgent = navigator.userAgent.toLowerCase();
			//var browserId = userAgent.match(/(firefox|chrome|safari|opera|msie)/)[1];
			//var browserVersion = (userAgent.match(new RegExp('.+(?:version)[\/: ]([\\d.]+)')) || userAgent.match(new RegExp('(?:' + browserId + ')[\/: ]([\\d.]+)')) || [0, '0'])[1];
			//var isIE6 = (browserId + browserVersion == "msie6.0");
			//var isIE7 = (browserId + browserVersion == "msie7.0");
			//var isIE8 = (browserId + browserVersion == "msie8.0");
			//var isIE9 = (browserId + browserVersion == "msie9.0");
			//var isIE10 = (browserId + browserVersion == "msie10.0");
			var pos = (parseInt(browserVersion) <= 6) ? 'absolute' : 'fixed';

			$("#popup_container").css({
				position: pos,
				zIndex: 99999,
				padding: 0,
				margin: 0,
				height: "auto"
			});

			$("#popup_title").text(title);
			$("#popup_content").addClass(type);
			$("#popup_message").text(msg);
			$("#popup_message").html( $("#popup_message").text().replace(/\n/g, '<br />') );

			$("#popup_container").css({
				minWidth: $("#popup_container").outerWidth(),
				maxWidth: $("#popup_container").outerWidth()
			});

			$.alerts._reposition();
			$.alerts._maintainPosition(true);

			switch( type ) {
				case 'alert':
					$("#popup_message").after('<div id="popup_panel"><input type="button" value="' + $.alerts.sureButton + '" id="popup_ok" /></div>');
					$("#popup_ok").click( function() {
						$.alerts._hide();
						callback(true);
					});
					$("#popup_ok").focus().keypress( function(e) {
						if( e.keyCode == null) $("#popup_ok").trigger('click');
					});
					$("#popup_close").click(function(){
						$.alerts._hide();
					});
				break;
				case 'confirm':
					$("#popup_message").after('<div id="popup_panel">' +
						'<input type="button" value="' + $.alerts.okButton + '" id="popup_ok" />' +
						' <input type="button" value="' + $.alerts.cancelButton + '" id="popup_cancel" /></div>');
					$("#popup_ok").click( function() {
						$.alerts._hide();
						if( callback ) callback(true);
					});
					$("#popup_cancel").click( function() {
						$.alerts._hide();
						if( callback ) callback(false);
					});
					$("#popup_close").click(function(){
						$.alerts._hide();
					});
					$(window).keypress( function(e) {
						if( e.keyCode == 89||e.keyCode == 121) {
							$("#popup_ok").is(":focus");
							$("#popup_ok").trigger('click');
						}
						else if( e.keyCode == 78||e.keyCode == 110 ) {
							$("#popup_cancel").is(":focus");
							$("#popup_cancel").trigger('click');
						};
					});
				break;
				case 'prompt':

					$("#popup_message").append('<br /><input type="text" size="30" id="popup_prompt" />')
						.after('<div id="popup_panel"><input type="button" value="' + $.alerts.okButton + '" id="popup_ok" />' +
						' <input type="button" value="' + $.alerts.cancelButton + '" id="popup_cancel" /></div>');
					$("#popup_prompt").width( $("#popup_message").width() );
					$("#popup_ok").click( function() {
						var val = $("#popup_prompt").val();
						$.alerts._hide();
						if( callback ) callback( val );
					});
					$("#popup_cancel").click( function() {
						$.alerts._hide();
						if( callback ) callback( null );
					});
					$("#popup_close").click(function(){
						$.alerts._hide();
					});
					$(document).keypress( function(e) {
						if( e.keyCode == 89||e.keyCode == 121) {
							$("#popup_ok").trigger('click');
						}
						else if( e.keyCode == 78||e.keyCode == 110 ) {
							$("#popup_cancel").trigger('click');
						};
					});

					$("#popup_prompt").focus(function(e){
						$(this).keypress(function(e){
							if(e.keyCode == 89||e.keyCode == 121){
								e.stopPropagation();
								e.cancelButton=true;
							}else if( e.keyCode == 78||e.keyCode == 110){
								e.stopPropagation();
								e.cancelButton=true;
							}
						})
					});

					if( value ) $("#popup_prompt").val(value);
				break;
			}

			// Make draggable
			if( $.alerts.draggable ) {
				try {
					$("#popup_container").draggable({ handle: $("#popup_title") });
					$("#popup_title").css({ cursor: 'move' });
				} catch(e) { /* requires jQuery UI draggables */ }
			}
		},

		_hide: function() {
			$("#popup_container").remove();
			$.alerts._overlay('hide');
			$.alerts._maintainPosition(false);
		},

		_overlay: function(status) {
			switch( status ) {
				case 'show':
					$.alerts._overlay('hide');
					$("BODY").append('<div id="popup_overlay"></div>');
					$("#popup_overlay").css({
						position: 'absolute',
						zIndex: 99998,
						top: '0px',
						left: '0px',
						width: '100%',
						height: $(document).height(),
						background: $.alerts.overlayColor,
						opacity: $.alerts.overlayOpacity
					});
				break;
				case 'hide':
					$("#popup_overlay").remove();
				break;
			}
		},

		_reposition: function() {
			var top = (($(window).height() / 2) - ($("#popup_container").outerHeight() / 2)) + $.alerts.verticalOffset;
			var left = (($(window).width() / 2) - ($("#popup_container").outerWidth() / 2)) + $.alerts.horizontalOffset;
			if( top < 0 ) top = 0;
			if( left < 0 ) left = 0;

			var u = window.navigator.userAgent.toLocaleLowerCase(),
            msie = /(msie) ([\d.]+)/,
            chrome = /(chrome)\/([\d.]+)/,
            firefox = /(firefox)\/([\d.]+)/,
            safari = /(safari)\/([\d.]+)/,
            opera = /(opera)\/([\d.]+)/,
            ie11 = /(trident)\/([\d.]+)/,
            b = u.match(msie) || u.match(chrome) || u.match(firefox) || u.match(safari) || u.match(opera) || u.match(ie11);

			var browserVersion = b[2];

		    // IE6 fix
			//var userAgent = navigator.userAgent.toLowerCase();
			//var browserId = userAgent.match(/(firefox|chrome|safari|opera|msie)/)[1];
			//var browserVersion = (userAgent.match(new RegExp('.+(?:version)[\/: ]([\\d.]+)')) || userAgent.match(new RegExp('(?:' + browserId + ')[\/: ]([\\d.]+)')) || [0, '0'])[1];
			if (parseInt(browserVersion) <= 6) top = top + $(window).scrollTop();

			$("#popup_container").css({
				top: top + 'px',
				left: left + 'px'
			});
			$("#popup_overlay").height( $(document).height() );
		},

		_maintainPosition: function(status) {
			if( $.alerts.repositionOnResize ) {
				switch(status) {
					case true:
						$(window).bind('resize', $.alerts._reposition);
					break;
					case false:
						$(window).unbind('resize', $.alerts._reposition);
					break;
				}
			}
		}

	}

	// Shortuct functions
	jAlert = function(message, title, callback) {
		$.alerts.alert(message, title, callback);
	}

	jConfirm = function(message, title, callback) {
		$.alerts.confirm(message, title, callback);
	};

	jPrompt = function(message, value, title, callback) {
		$.alerts.prompt(message, value, title, callback);
	};
	
})(jQuery);
