// SCROLLTOTOP BUTTON
// $(document).ready(function(){
    
    //Check to see if the window is top if not then display button
    $(window).scroll(function(){
        if ($(this).scrollTop() > 400) {
            $('#backTop').fadeIn();
        } else {
            $('#backTop').fadeOut();
        }
    });
    
    //Click event to scroll to top
    $('#backTop').click(function(){
        $('html, body').animate({scrollTop : 0},800);
        return false;
    });

    $('#installMove').click(function(){
    	$('html, body').animate({
    		scrollTop: $('#installPage').offset().top
    	}, 800);
    });

    $('#clientMove').click(function(){
    	$('html, body').animate({
    		scrollTop: $('#clientPage').offset().top
    	}, 800);
    });
    
    $('#serverMove').click(function(){
    	$('html, body').animate({
    		scrollTop: $('#serverPage').offset().top
    	}, 800);
    });

    $('#gitMove').click(function(){
    	$('html, body').animate({
    		scrollTop: $('#gitPage').offset().top
    	}, 800);
    });

    $('#hostMove').click(function(){
    	$('html, body').animate({
    		scrollTop: $('#hostPage').offset().top
    	}, 800);
    });

// });









