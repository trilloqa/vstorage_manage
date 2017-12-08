var manage = {};

Trillo.prePageShown = function() {
  var theme = Trillo.navHistory.getItemByKey("VStorage.manage.theme." + Trillo.appContext.user.userId);
  if (!theme) {
    theme = Trillo.appContext.user.tenantProps ? Trillo.appContext.user.tenantProps.colorTheme : null;
    if (!theme) {
      theme = "green";
    }
  }
  $('body').attr('data-ma-theme', theme);
  // Active Stat
  $('body').on('focus', '.search__text', function() {
    $(this).closest('.search').addClass('search--focus');
  });

  // Clear
  $('body').on('blur', '.search__text', function() {
    $(this).val('');
    $(this).closest('.search').removeClass('search--focus');
  });
}

Trillo.postPageShown = function() {
  var theme = Trillo.navHistory.getItemByKey("VStorage.manage.theme." + Trillo.appContext.user.userId);
  if (!theme) {
    theme = "green";
  }
  console.log("value: " + $('.theme-switch input:radio[value="' + theme + '"]').val());
  $('.theme-switch input:radio[value="' + theme + '"]').attr("checked", "checked");
  $('.theme-switch label.bg-' + theme).addClass("active");
  if ($(".left-column").hasClass("toggled")) {
    $(".left-column").removeClass("toggled");
    $('[nm="toggleSideBar"]').removeClass("toggled");
  }
}
