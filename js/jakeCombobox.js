(function ($) {
    $.expr[':'].icontains = function (a, i, m) {
        return $(a).text().toUpperCase().indexOf(m[3].toUpperCase()) === 0;
    };

    $.widget("jake.combobox", {

        downArrow: '&#x25BC;',

        options: {
            isOpen: false,
            change: null
        },

        _create: function () {
            var $select = this.element;
            $select.hide();

            var combobox = this._createComboBox();
            this.$combobox = $(combobox);
            this._cacheElements();
            this._bindUIActions();
            $select.after(this.$combobox);
            this._refresh();
        },

        _refresh: function () {
        },

        _destroy: function () {
            this.$combobox.remove();
            this.element.show();
        },

        _createLi: function (val, text) {
            return ''
                + '<li data-value="' + val + '">'
                + '<span data-value="' + val + '">' + text + '</span>'
                + '</li>';
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
                + '<div class="combobox">'
                + '<input type="text" class="txtbox" />'
                + '<a href="#" class="txtbox-btn">' + this.downArrow + '</a>'
                + '</div>'
                + '<ul class="combobox-options">'
                + this._createLis(this.element.children('option'))
                + '</ul>';
            return combobox;
        },

        _openClose: function () {
            this.elements.$options.slideToggle(300);
        },

        _selectLi: function (e) {
            var $selectedLi = $(e.target),
                selectedValue = $selectedLi.data('value');

            this.elements.$txtbox.val(selectedValue);
            this._openClose();

            this.element.val(selectedValue);

            this._trigger("change");
        },

        _autocomplete: function () {
            var term = this.elements.$txtbox.val();
            var $results = null;

            if (term !== '') {
                $results = this.elements.$lis.find('span:icontains(' + term + ')');
            }
            if ($results && $results.length > 0) {
                this.elements.$options.show();
                this.elements.$lis.show();
                this.elements.$lis.children().show();

                var $spans = this.elements.$lis.children().not($results);
                $spans.parent().hide();
                $spans.hide();
            } else {
                this.elements.$options.hide();
                this.elements.$lis.show();
                this.elements.$lis.children().show();
            }
        },

        _bindUIActions: function () {

            this.elements.$options.hide();
            if (this.options.isOpen) {
                this.elements.$options.show();
            }

            this._on(this.elements.$txtboxBtn, {
                click: '_openClose'
            });

            this._on(this.elements.$lis, {
                click: '_selectLi'
            });

            this._on(this.elements.$txtbox, {
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
            var $options = this.$combobox.siblings('.combobox-options');
            this.elements = {
                $txtboxBtn: this.$combobox.find('.txtbox-btn'),
                $txtbox: this.$combobox.find('.txtbox'),
                $options: $options,
                $lis: $options.children(),
                ".txtbox": this.$combobox.find('.txtbox')
            };

        }
    });
})(jQuery);