$(function () {

    var w = $(window).outerWidth();
    var isMobile = ('ontouchstart' in window);
    const breakpoint_md4 = 479.98;
    
    /*Когда у скролла есть wrapScroll ему нужно задать высоту 
так как его дочерний элемент абсолютно позиционирован */
function setHeightWrapScroll() {
	if($('.wrapScroll').length !== 0){
		var scrollHeight = $('.scroll').height();
		$('.wrapScroll').css('height', scrollHeight+'px');
	}
}
setHeightWrapScroll();

/* ВНИМАНИЕ!!! 
	Если кнопки скролла внутри блока .scroll то все ок, а если снаружи то для
	.scroll нужно задать data-scroll-id="" и также и для .scroll__button.btn-prev и 
	для .scroll__button.btn-next.
*/


var ScrollElement = function(elem) {
	var body = elem.find('.scroll__body');
	var scroll = elem.find('.scroll__scroll');
	var wBody = body.width();
	var wScroll = scroll.width();
	var scrollID = elem.data('scroll-id');
	if(scrollID == undefined){ // Если кнопки управления лежат внутри .scroll
		var btn_prev = elem.find('.scroll__button.btn-prev');
		var btn_next = elem.find('.scroll__button.btn-next');
	}else{ // Если кнопки управления лежат где то снаружи
		var btn_prev = elem.find('.scroll__button.btn-prev[data-scroll-id='+scrollID+']');
		var btn_next = elem.find('.scroll__button.btn-next[data-scroll-id='+scrollID+']');
	}
	
	var overlay_prev = elem.find('.overlayArea-prev');
	var overlay_next = elem.find('.overlayArea-next');

	// Просчитываем количество проскролла и выдаем scrollPosition
	var calcPosition = function (action, direction) {
		var diff = Math.round(scroll.width() - body.width());
		var scrollLeft = Math.round(body.scrollLeft());

		if(action === 'buttonClick'){
			var stepScroll = elem.width() * 80 / 100;
			if(direction === 'next'){
				scrollLeft += stepScroll;
				if(scrollLeft > diff){scrollLeft = diff;}
			}else{
				scrollLeft -= stepScroll;
				if(scrollLeft < 0){scrollLeft = 0;}
			}
		}
		if(scrollLeft === 0){
			scrollPosition('start');
		}else if(scrollLeft === diff){
			scrollPosition('finish');
		}else{
			scrollPosition('center');
		}
		return scrollLeft;
	}

	// Клик по кнопкам (только для DESKTOP)
	var buttonClick = function (direction){
		var scrollLeft = calcPosition('buttonClick', direction);
		body.stop().animate({scrollLeft:scrollLeft}, 500, 'swing');
	}

	// Скрыть показать кнопки в зависимости от положения скролла
	var scrollPosition = function (position) {
		if(position === 'start'){
			if(isMobile === false){
				btn_prev.removeClass('open');
				btn_next.addClass('open');
			}
			overlay_prev.removeClass('open');
			overlay_next.addClass('open');
		}else if (position === 'center'){
			if(isMobile === false){
				btn_prev.addClass('open');
				btn_next.addClass('open');
			}
			overlay_prev.addClass('open');
			overlay_next.addClass('open');
		}else if(position === 'finish'){
			if(isMobile === false){
				btn_prev.addClass('open');
				btn_next.removeClass('open');
			}
			overlay_prev.addClass('open');
			overlay_next.removeClass('open');
		}else if(position === 'not-scroll'){
			if(isMobile === false){
				btn_prev.removeClass('open');
				btn_next.removeClass('open');
			}
			overlay_prev.removeClass('open');
			overlay_next.removeClass('open');
		}
	}

	// Начальное положение скролла (скролл есть или его нет)
	wScroll > wBody ? scrollPosition('start') : scrollPosition('not-scroll');

	if(isMobile){
		btn_prev.removeClass('open');
		btn_next.removeClass('open');
		
	}else{
		btn_next.click(function(){ buttonClick('next'); });
		btn_prev.click(function(){ buttonClick('prev'); });
	}
	body.scroll(function(){calcPosition();});
}

$(".scroll").each(function(){
	if(!(w < breakpoint_md4 && $(this).hasClass('js-not-md4'))){
		new ScrollElement($(this));
	}
});;

    // Бесконечная прокрутка
    $('.js-marquee').marquee({
	    duration: 20000,
	    startVisible: true,
	    duplicated: true,
        gap: 0
	});

///////////////////// Логика клика по ценам в блоке цен ////////////////////////

// Отформатировать число в денежный формат
function formatCurrency(amount) {
    const roundedAmount = Math.round(amount);
    const formattedAmount = roundedAmount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    return formattedAmount + "$";
}

// Извлечь данные из кликнутой ячейки и вставить в ценник 
$(".js-itemCost-logic .itemCost").click(function(){
    $(".js-itemCost-logic .itemCost").removeClass("itemCost_active");
    $(this).addClass("itemCost_active");
    let price1 = $(this).data("price-1");
    let price2 = $(this).data("price-2");
    let text = $(this).find(".itemCost__title").text();

    // Меняем текст с анимацией
    $(".js-receipt").removeClass("js-receipt-anim");
    setTimeout(function() {
        $(".js-price-title").text(text);
        $(".js-price-result-1").text(formatCurrency(price1));
        $(".js-price-result-2").text(formatCurrency(price2));
        $(".js-price-result-total").text(formatCurrency(price1+price2));

        $(".js-receipt").addClass("js-receipt-anim");
    }, 100);
})

/////////////////////// АНИМАЦИЯ ТЕМАТИКИ ///////////////////////////////////////

function activateItems() {
    var items = $('.subjects .subjects__item');
    var currentIndex = 0;

    function activateNext() {
        // Убираем класс active у всех элементов
        items.removeClass('active');
        
        // Если текущий индекс равен последнему элементу
        if (currentIndex === items.length - 1) {
            // Назначаем класс active последнему элементу на 3 секунды
            items.eq(currentIndex).addClass('active');
            setTimeout(function() {
                items.eq(currentIndex).removeClass('active');
                currentIndex = 0; // Сбрасываем индекс
                activateNext(); // Запускаем заново
            }, 3000);
        } else {
            // Назначаем класс active текущему элементу на 300 мс
            items.eq(currentIndex).addClass('active');
            setTimeout(function() {
                items.eq(currentIndex).removeClass('active');
                currentIndex++;
                activateNext(); // Рекурсивно вызываем себя для следующего элемента
            }, 300);
        }
    }

    // Запускаем функцию активации
    activateNext();
}

activateItems();

//////////////////////////////////////////////////////////////////////////////////

});