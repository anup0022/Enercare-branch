"use strict";

(function ($, document) {
  function bogoFormPresentation() {
    var boilerFurnaceFieldset = $('fieldset.radio__boiler-furnace');
    var furnaceRadios = boilerFurnaceFieldset.find('input[value=Furnace][type=radio]');
    var boilerRadios = boilerFurnaceFieldset.find('input[value=Boiler][type=radio]');
    var choiceLabels = boilerFurnaceFieldset.find('.gchoice label');
    var choiceInputs = boilerFurnaceFieldset.find('input');

    var inputChanges = function inputChanges(target) {
      $('.gchoice.selected').removeClass('selected');

      if (target.parent().hasClass('selected')) {
        target.parent().removeClass('selected');
      } else {
        target.parent().addClass('selected');
      }
    };

    var setSelect = function setSelect(target) {
      console.log(target);

      if (target[0].checked) {
        target.parent().addClass('selected');
      }
    };

    choiceInputs.each(function () {
      setSelect($(this));
    });
    choiceInputs.on('change', function () {
      inputChanges($(this));
    });
    choiceLabels.on('click', function (event) {
      inputChanges($(this));
    });
    $('<img alt="" role="presentation" width=60 height=60 src="/wp-content/uploads/2021/10/furnace-24px-b.svg"/>').insertBefore(furnaceRadios);
    $('<img alt="" role="presentation" width=60 height=60 src="/wp-content/uploads/2021/10/boiler-24px-b.svg"/>').insertBefore(boilerRadios);
  }

  $(document).on('gform_post_render', function () {
    bogoFormPresentation();
  });
})(jQuery, document);