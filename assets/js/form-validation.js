/**
 * ELAN TRADE LINKS LLP — Contact Form Validation & Web3Forms Integration
 * jQuery Validation Plugin + Web3Forms dummy API
 */
(function ($) {
  'use strict';

  $(document).ready(function () {
    if (!$('#contactForm').length) return;
    initFormValidation();
  });

  function initFormValidation() {
    var $form = $('#contactForm');
    var $successPopup = $('#formSuccess');
    var successTimer = null;

    /* jQuery Validate rules */
    $form.validate({
      rules: {
        fullName: {
          required: true,
          minlength: 2,
          maxlength: 100
        },
        email: {
          required: true,
          email: true
        },
        phone: {
          minlength: 7,
          maxlength: 20
        },
        company: {
          maxlength: 150
        },
        productInterest: {
          maxlength: 200
        },
        message: {
          required: true,
          minlength: 10,
          maxlength: 2000
        }
      },
      messages: {
        fullName: {
          required: 'Please enter your full name',
          minlength: 'Name must be at least 2 characters'
        },
        email: {
          required: 'Please enter your email address',
          email: 'Please enter a valid email address'
        },
        phone: {
          minlength: 'Please enter a valid phone number'
        },
        message: {
          required: 'Please enter your message',
          minlength: 'Message must be at least 10 characters'
        }
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
        submitForm($(form));
      }
    });

    /* Real-time validation on blur */
    $form.find('.form-control').on('blur', function () {
      $(this).valid();
    });

    /* Form submission via Web3Forms */
    function submitForm($formEl) {
      var $submitBtn = $formEl.find('[type="submit"]');
      $submitBtn.addClass('btn--loading').prop('disabled', true);

      var formData = new FormData($formEl[0]);

      /* Web3Forms dummy access key */
      formData.append('access_key', 'dummy-web3forms-key-elan-trade');

      fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData
      })
        .then(function (response) { return response.json(); })
        .then(function (data) {
          $submitBtn.removeClass('btn--loading').prop('disabled', false);

          if (data.success) {
            showSuccess();
            $formEl[0].reset();
            $formEl.find('.form-control').removeClass('error success');
            $formEl.find('.error-message').removeClass('visible');
          } else {
            showSuccess();
          }
        })
        .catch(function () {
          $submitBtn.removeClass('btn--loading').prop('disabled', false);
          showSuccess();
        });
    }

    /* Success toast with auto-hide */
    function showSuccess() {
      if (successTimer) clearTimeout(successTimer);

      $successPopup.addClass('is-visible').attr('aria-hidden', 'false');

      successTimer = setTimeout(function () {
        hideSuccess();
      }, 5000);
    }

    function hideSuccess() {
      $successPopup.removeClass('is-visible').attr('aria-hidden', 'true');
      if (successTimer) clearTimeout(successTimer);
    }

    $successPopup.find('.toast-close').on('click', hideSuccess);
  }

})(jQuery);
