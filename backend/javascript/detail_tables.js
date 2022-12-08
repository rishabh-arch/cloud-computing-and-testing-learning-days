$(window).on('resize', function () {

    if ($(this).width() < 765) {
        $('tr td:first-child').click(function () {

            $(this).siblings().css({ 'display': 'inline-block' });

            var $this = $(this);
            setTimeout(function () {
                $this.siblings().css('transform', 'translateY(0)');
            }, 0);

            $('tr td:first-child').not($(this)).siblings().css({ 'display': 'none', 'transform': 'translateY(-9999px)' });
        });
    }
    else if ($(this).width() > 760) {
        $("tr td:first-child").unbind("click");
        $('tr td:first-child').siblings().css({ 'display': '', 'transform': '' });
    }

}).resize();