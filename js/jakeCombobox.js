(function ($) {
    $.expr[':'].icontains = function (a, i, m) {
        return $(a).text().toUpperCase().indexOf(m[3].toUpperCase()) === 0;
    };

    $.widget("jake.combobox", {

        options: {
            //down arrow
            buttonText: '&#x25BC;',
            isOpen: false,
            change: null
        },

        _create: function () {
            var $select = this.element;
            $select.hide();

            var combobox = this._createComboBox();
            this.combobox = $(combobox);
            this._cacheElements();
            this._bindUIActions();
            $select.after(this.combobox);
            this._refresh();
        },

        _refresh: function () {
        },

        _destroy: function () {
            this.combobox.remove();
            this.element.show();
        },

        _createLi: function (val, text) {
            return ''
                + '\t<li data-value="' + val + '">'
                + '<span data-value="' + val + '">' + text + '</span>'
                + '</li>\n';
        },

        _createLis: function (options) {
            var self = this, lis = [];
            $.each(options, function (key, option) {
                var $option = $(option),
                    li = self._createLi($option.val(), $option.text());
                lis.push(li);
            });
            return lis.join('');
        },

        _createComboBox: function () {
            var combobox = ''
                + '<div class="combobox">\n'
                + '\t<input type="text" class="txtbox" />\n'
                + '\t<a href="#" class="txtbox-btn">' + this.options.buttonText + '</a>\n'
                + '</div>\n'
                + '<ul class="combobox-options">\n'
                + this._createLis(this.element.children('option'))
                + '</ul>\n';
            return combobox;
        },

        _openClose: function () {
            this.cached['.combobox-options'].slideToggle(300);
        },

        _selectLi: function (e) {
            var $selectedLi = $(e.target),
                selectedValue = $selectedLi.data('value');

            this.cached['.txtbox'].val(selectedValue);
            this._openClose();

            this.element.val(selectedValue);

            this._trigger("change");
        },

        _autocomplete: function () {
            var term = this.cached['.txtbox'].val(),
                $results = null;

            if (term !== '') {
                $results = this.cached['.combobox-options li'].find('span:icontains(' + term + ')');
            }
            if ($results) {
                this.cached['.combobox-options'].show();
                this.cached['.combobox-options li'].show();
                this.cached['.combobox-options li'].children().show();

                var $spans = this.cached['.combobox-options li'].children().not($results);
                $spans.parent().hide();
                $spans.hide();
            } else {
                this.cached['.combobox-options'].hide();
                this.cached['.combobox-options li'].show();
                this.cached['.combobox-options li'].children().show();
            }
        },

        _bindUIActions: function () {

            this.cached['.combobox-options'].hide();
            if (this.options.isOpen) {
                this.cached['.combobox-options'].show();
            }

            this._on(this.cached['.txtbox-btn'], {
                click: '_openClose'
            });

            this._on(this.cached['.combobox-options li'], {
                click: '_selectLi'
            });

            this._on(this.cached['.txtbox'], {
                keyup: '_autocomplete'
            })
        },

        val: function () {
            return this.element.children(":selected").val();
        },

        text: function () {
            return this.element.children(":selected").text();
        },

        _setOptions: function () {
            this._superApply(arguments);
            this._refresh();
        },

        _setOption: function (key, value) {
            this._super(key, value);
        },

        _cacheElements: function () {
            var $combobox = this.combobox;
            var $txtboxBtn = $combobox.find('.txtbox-btn');
            var $txtbox = $combobox.find('.txtbox');
            var $options = $combobox.siblings('.combobox-options');
            var $lis = $options.children();

            this.cached = {
                ".txtbox-btn": $txtboxBtn,
                ".combobox-options": $options,
                ".combobox-options li": $lis,
                ".txtbox": $txtbox
            };

        }
    });
})(jQuery);