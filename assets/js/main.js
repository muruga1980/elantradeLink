/**
 * ELAN TRADE LINKS LLP — Main JavaScript
 * jQuery-based interactions, AOS, UI enhancements
 */
(function ($) {
  'use strict';

  /* --- Config --- */
  var SCROLL_THRESHOLD = 80;
  var BACK_TO_TOP_THRESHOLD = 400;
  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* --- DOM Ready --- */
  $(document).ready(function () {
    initAOS();
    initStickyHeader();
    initMobileMenu();
    initSmoothScroll();
    initBackToTop();
    initScrollProgress();
    initLazyLoad();
    initActiveNav();
  });

  /* --- AOS Initialization --- */
  function initAOS() {
    if (typeof AOS !== 'undefined') {
      AOS.init({
        duration: prefersReducedMotion ? 0 : 800,
        easing: 'ease-out-cubic',
        once: true,
        offset: 60,
        disable: prefersReducedMotion ? true : false
      });
    }
  }

  /* --- Sticky Header --- */
  function initStickyHeader() {
    var $header = $('.site-header');
    if (!$header.length) return;

    function updateHeader() {
      if ($(window).scrollTop() > SCROLL_THRESHOLD) {
        $header.addClass('is-scrolled');
      } else {
        $header.removeClass('is-scrolled');
      }
    }

    updateHeader();
    $(window).on('scroll', throttle(updateHeader, 16));
  }

  /* --- Mobile Menu --- */
  function initMobileMenu() {
    var $toggle = $('.menu-toggle');
    var $mobileNav = $('.nav-mobile');
    var $body = $('body');

    $toggle.on('click', function () {
      var isOpen = $mobileNav.hasClass('is-open');
      if (isOpen) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    $('.nav-mobile-backdrop, .nav-mobile-link').on('click', function () {
      closeMenu();
    });

    function openMenu() {
      $toggle.addClass('is-open').attr('aria-expanded', 'true');
      $mobileNav.addClass('is-open');
      $body.css('overflow', 'hidden');
    }

    function closeMenu() {
      $toggle.removeClass('is-open').attr('aria-expanded', 'false');
      $mobileNav.removeClass('is-open');
      $body.css('overflow', '');
    }

    $(document).on('keydown', function (e) {
      if (e.key === 'Escape' && $mobileNav.hasClass('is-open')) {
        closeMenu();
        $toggle.focus();
      }
    });
  }

  /* --- Smooth Scroll --- */
  function initSmoothScroll() {
    $('a[href^="#"]').on('click', function (e) {
      var target = $(this.getAttribute('href'));
      if (target.length) {
        e.preventDefault();
        var offset = $('.site-header').outerHeight() || 72;
        $('html, body').animate({
          scrollTop: target.offset().top - offset
        }, prefersReducedMotion ? 0 : 600);
      }
    });
  }

  /* --- Back to Top --- */
  function initBackToTop() {
    var $btn = $('.back-to-top');
    if (!$btn.length) return;

    function toggleBtn() {
      if ($(window).scrollTop() > BACK_TO_TOP_THRESHOLD) {
        $btn.addClass('is-visible');
      } else {
        $btn.removeClass('is-visible');
      }
    }

    toggleBtn();
    $(window).on('scroll', throttle(toggleBtn, 100));

    $btn.on('click', function () {
      $('html, body').animate({ scrollTop: 0 }, prefersReducedMotion ? 0 : 600);
    });
  }

  /* --- Scroll Progress Indicator --- */
  function initScrollProgress() {
    var $progress = $('.scroll-progress');
    if (!$progress.length) return;

    $(window).on('scroll', throttle(function () {
      var scrollTop = $(window).scrollTop();
      var docHeight = $(document).height() - $(window).height();
      var progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      $progress.css('width', progress + '%');
    }, 16));
  }

  /* --- Lazy Load Images --- */
  function initLazyLoad() {
    if ('loading' in HTMLImageElement.prototype) {
      $('img[data-src]').each(function () {
        $(this).attr('src', $(this).data('src')).removeAttr('data-src');
      });
      return;
    }

    if ('IntersectionObserver' in window) {
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var img = entry.target;
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
            observer.unobserve(img);
          }
        });
      }, { rootMargin: '200px' });

      document.querySelectorAll('img[data-src]').forEach(function (img) {
        observer.observe(img);
      });
    }
  }

  /* --- Active Navigation Highlighting --- */
  function initActiveNav() {
    var currentPage = window.location.pathname.split('/').pop() || 'index.html';

    $('.nav-link, .nav-mobile-link').each(function () {
      var href = $(this).attr('href');
      if (!href) return;

      var linkPage = href.split('/').pop().split('#')[0];
      if (linkPage === currentPage || (currentPage === '' && linkPage === 'index.html')) {
        $(this).addClass('is-active');
      }
    });

    /* Scroll-based active nav for single-page sections */
    if ($('[data-section]').length) {
      var $sections = $('[data-section]');
      var $navLinks = $('.nav-link[href^="#"]');

      $(window).on('scroll', throttle(function () {
        var scrollPos = $(window).scrollTop() + ($('.site-header').outerHeight() || 72) + 20;

        $sections.each(function () {
          var $section = $(this);
          var top = $section.offset().top;
          var bottom = top + $section.outerHeight();
          var id = $section.attr('id');

          if (scrollPos >= top && scrollPos < bottom) {
            $navLinks.removeClass('is-active');
            $navLinks.filter('[href="#' + id + '"]').addClass('is-active');
          }
        });
      }, 100));
    }
  }

  /* --- Utility: Throttle --- */
  function throttle(fn, delay) {
    var last = 0;
    return function () {
      var now = Date.now();
      if (now - last >= delay) {
        last = now;
        fn.apply(this, arguments);
      }
    };
  }

})(jQuery);
