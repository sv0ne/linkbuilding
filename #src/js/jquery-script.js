$(function () {

    var w = $(window).outerWidth();
    var isMobile = ('ontouchstart' in window);
    const breakpoint_md4 = 479.98;
    
    @@include('_scroll.js');

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