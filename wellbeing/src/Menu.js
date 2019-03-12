export class Menu {

  static initMenu() {
    $('.navToggle').click(function () {
      $(this).toggleClass('active');

      if ($(this).hasClass('active')) {
        $('.globalMenu').addClass('active');
      } else {
        $('.globalMenu').removeClass('active');
      }
    });

    // if content is clicked, close menu.
    $('.globalMenu').click(function () {
      $('.navToggle').removeClass('active');
      $('.globalMenu').removeClass('active');
    });
  }

  static initModal() {
    let menuSetting = document.getElementsByClassName('menu');
    for (let i = 0, l = menuSetting.length; i < l; i++) {
      menuSetting[i].addEventListener('click', (e) => {
        let id = e.target.id.slice(4,);
        // $(this).blur();
        $('menuSetting').blur();
        if ($("#modalOverlay")[0]) {
          return false;
        }
        $("body").append('<div id="modalOverlay"></div>');
        $("#modalOverlay").fadeIn(400);

        // contentごとに書き換え
        $("#modalContentWrapper" + id.toString()).fadeIn(400);
        $("#modalOverlay, .modalClose").unbind()
            .click(function () {
              $("#modalContentWrapper" + id.toString() + ", #modalOverlay").fadeOut(400, function () {
                $("#modalOverlay").remove();
              });
            });
      }, false);
    }
  }


}

