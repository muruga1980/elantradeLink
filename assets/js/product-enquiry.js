/**
 * ELAN TRADE LINKS LLP — Product Enquiry Modal
 */
(function ($) {
  'use strict';

  $(document).ready(function () {
    if (!$('#enquiryModal').length) return;
    initProductEnquiry();
  });

  function initProductEnquiry() {
    var $modal = $('#enquiryModal');
    var $form = $('#enquiryForm');
    var $toast = $('#enquiryToast');
    var $productField = $('#enquiryProduct');
    var $title = $('#enquiryModalTitle');
    var toastTimer = null;

    $('.btn-enquiry').on('click', function () {
      var productName = $(this).closest('.card-body').find('.card-title').text().trim();
      openModal(productName);
    });

    $('[data-close-modal]').on('click', closeModal);

    $(document).on('keydown', function (e) {
      if (e.key === 'Escape' && $modal.hasClass('is-open')) {
        closeModal();
      }
    });

    $form.validate({
      rules: {
        fullName: { required: true, minlength: 2 },
        email: { required: true, email: true },
        message: { required: true, minlength: 10 }
      },
      errorElement: 'div',
      errorClass: 'error-message visible',
      highlight: function (element) {
        $(element).addClass('error').removeClass('success');
      },
      unhighlight: function (element) {
        $(element).removeClass('error').addClass('success');
      },
      errorPlacement: function (error, element) {
        error.insertAfter(element);
      },
      submitHandler: function (form) {
        var $submitBtn = $(form).find('[type="submit"]');
        $submitBtn.addClass('btn--loading').prop('disabled', true);

        setTimeout(function () {
          $submitBtn.removeClass('btn--loading').prop('disabled', false);
          form.reset();
          $form.find('.form-control').removeClass('error success');
          $form.find('.error-message').removeClass('visible');
          closeModal();
          showToast();
        }, 800);
      }
    });

    function openModal(productName) {
      $productField.val(productName);
      $title.text('Enquiry: ' + productName);
      $modal.addClass('is-open').attr('aria-hidden', 'false');
      $('body').css('overflow', 'hidden');
      $('#enquiryName').focus();
    }

    function closeModal() {
      $modal.removeClass('is-open').attr('aria-hidden', 'true');
      $('body').css('overflow', '');
    }

    function showToast() {
      if (toastTimer) clearTimeout(toastTimer);
      $toast.addClass('is-visible').attr('aria-hidden', 'false');
      toastTimer = setTimeout(hideToast, 5000);
    }

    function hideToast() {
      $toast.removeClass('is-visible').attr('aria-hidden', 'true');
      if (toastTimer) clearTimeout(toastTimer);
    }

    $toast.find('.toast-close').on('click', hideToast);
  }

})(jQuery);
