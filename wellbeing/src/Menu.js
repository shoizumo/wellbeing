export class Menu {

  static initMenu() {
    $('.navToggle').click(function (e) {
      $(this).toggleClass('active');

      if ($(this).hasClass('active')) {
        $('.globalMenu').addClass('active');
      } else {
        $('.globalMenu').removeClass('active');
      }

      e.stopPropagation();
    });

    // if content is clicked, close menu (use stopPropagation)
    $('body').click(function () {
      $('.navToggle').removeClass('active');
      $('.globalMenu').removeClass('active');
    });
  }

  static initModal() {
    let menuSetting = document.getElementsByClassName('menu');
    for (let i = 0, l = menuSetting.length; i < l; i++) {
      menuSetting[i].addEventListener('click', (e) => {
        let id = e.target.id.slice(4,);
        // $('menuSetting').blur();
        if ($("#modalOverlay")[0]) {
          return false;
        }
        $("body").append('<div id="modalOverlay"></div>');
        $("#modalOverlay").fadeIn(400);

        // contentごとに書き換え
        $("#modalContentWrapper" + id.toString()).fadeIn(400);
        $("#modalOverlay, .modalClose").unbind();
        $("#modalOverlay, .modalClose, .navToggle").click(function () {
          $("#modalContentWrapper" + id.toString() + ", #modalOverlay").fadeOut(400, function () {
            $("#modalOverlay").remove();
          });
        });
      }, false);
    }
  }


}

