//All possible card values
const cards = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
//All possible suits
const suits = ["Hearts", "Diamonds", "Spades", "Clubs"];
//A set of all face cards
const face_cards = new Set(['J', 'Q', 'K', 'A']);
//Base array set to store the players hand [number(int), suit(string)]
const player_hand = [['', ''], ['', '']];
//Base array set to store the dealers hand [number(int), suit(string)]
var dealer_hand = ['', ''];

//Decalring html elemnts for easy acces and readabilty in functions
const player_card1_img = document.getElementById("player_card1");
const player_card2_img = document.getElementById("player_card2");
const dealer_card_img = document.getElementById("dealer_card");

var feedback_text = document.getElementById("feedback_text");

var right_move;

const info_div = document.getElementById("info_screen");

info_div.style.display = "none";

function run(){
    right_move = "";
    deal();
    right_move = find_right_move()
    console.log(right_move)
}
run()

function deal(){
    //Gives dealer one and player two cards
    player_hand[0] = getCard();
    player_hand[1] = getCard();
    dealer_hand = getCard();
    //Set images to proper card
    player_card1_img.src = "playingCards\\" + player_hand[0][0] + player_hand[0][1] + ".png";
    player_card2_img.src = "playingCards\\" + player_hand[1][0] + player_hand[1][1] + ".png";
    dealer_card_img.src = "playingCards\\" + dealer_hand[0] + dealer_hand[1] + ".png";
    
    function getCard(){
        //Returns a random card
        return [cards[Math.floor(Math.random() * 13)], suits[Math.floor(Math.random() * 4)]];
    }
}



function find_hand_values(){
    //Finds the value of hands
    var splitable = false;
    var soft = false;

    var player_hand_value = find_card_value(player_hand[0][0]);
    player_hand_value += find_card_value(player_hand[1][0]);

    var dealer_hand_value = find_card_value(dealer_hand[0]);
    
    //Checks if hands are splitable or soft
    if(player_hand[0][0] == player_hand[1][0]){
        splitable = true;
    }
    if(player_hand[0][0] == 'A' || player_hand[1][0] == 'A'){
        soft = true;
    }

    function find_card_value(card){
        if(face_cards.has(card)){
            if(card == 'A') {
                return 11;
            }
            else return 10;
        }

        return parseInt(card)
    }
    console.log("Player Value: " + player_hand_value + "\nDealer Value:" + dealer_hand_value + "\nSplittable: " + splitable + "\nSoft: " + soft);
    return [player_hand_value, dealer_hand_value, splitable, soft]
}

function find_right_move(){
    const cards_info = find_hand_values();
    var player_value = cards_info[0];
    var dealer_value = cards_info[1];
    var splitable = cards_info[2];
    var soft = cards_info[3];

    if(player_value == 21){
        right_move = "Blackjack";
        player_input("Blackjack")
    }

    //Start with nonsplitable and no soft hands
    if(!splitable && !soft){
        if(player_value <= 8) return "Hit";

        if (player_value == 9){
            if(2 < dealer_value && dealer_value < 7) return "Hit";
            return "Double";
        }

        if(player_value == 10){
            if(9 < dealer_value && dealer_value < 12) return "Hit";
            return "Double";
        }

        if(player_value == 11) return "Double";

        if(player_value == 12){
            if(3 < dealer_value && dealer_value < 7) return "Stand";
            return "Hit";
        }

        if(12 < player_value && player_value < 17){
            if(dealer_value < 7) return "Stand";
            return "Hit";
        }

        if(16 < player_value && player_value < 21) return "Stand";
    }
    //Always Split Aces
    if(splitable && soft) return "Split";
    if(splitable){
        //Splitable hands *REMBER 2s = 4 3s = 6 so odd #s dont apply in the ranges
        if(3 < player_value && player_value < 7){
            if(dealer_value < 8) return "Split";    
            return "Hit";      
        }

        if(player_value == 8){
            if(4 < dealer_value && dealer_value < 7) return "Split";
            return "Hit";
        }

        if(player_value == 10){
            if(dealer_value < 10) return "Double";
            return "Hit";
        }

        if(player_value == 12){
            if(dealer_value < 7) return "Split";
            return "Hit";
        }

        if(player_value == 14){
            if(dealer_value < 8) return "Split";
            return "Hit";
        }

        if(player_value == 16) return "Split";
        
        if(player_value == 17) return "Stand";

        if(player_value == 18){
            if(dealer_value == 7 || dealer_value > 9) return "Stand";
            return "Split";
        }
        if(player_value == 20) return "Stand";
    }
    if(soft){
        if(player_value == 13 || player_value == 14){
            if(4 < dealer_value && dealer_value < 7) return "Double";
            return "Hit";
        }

        if(player_value == 15 || player_value == 16){
            if(3 < dealer_value && dealer_value < 7) return "Double";
            return "Hit";
        }

        if(player_value == 17){
            if(dealer_value == 2 || dealer_value > 6) return "Hit";
            return "Double";
        }
        if(player_value == 18){
            if(2 < dealer_value && dealer_value< 7) return "Double";
            if(dealer_value < 9) return "Stand";
            return "Hit";
        }

        if(player_value >= 19) return "Stand";
    }
}

//Below is player input handiling
function player_input(move){
    if(move == "Blackjack"){
        console.log("BlackJack")
        feedback_text.innerHTML = "BLACKJACK!";
        feedback_text.style.color = "violet";
        setTimeout(blackjack_sleep, 1000);
        function blackjack_sleep(){
            run();
        }
    }
    else if(right_move == move){
        console.log("Correct");
        feedback_text.innerHTML = "Correct";
        feedback_text.style.color = "green";
        run()
    }else{
        console.log("Incorrect, the correct move was to " + right_move);
        feedback_text.innerHTML = "Incorrect, the correct move was to " + right_move;
        feedback_text.style.color = "red";
        run()
    }

    
}


function toggleInfo(){
    if(info_div.style.display === "none"){
        info_div.style.display = "block";
    }else{
        info_div.style.display = "none";
    }
    
}




//Test to make sure there are no undefiend right_move
//just call test with n as the number of iteration you want and it will break if there is an unexpected answer
function test(n){
    const possible_moves = new Set(["Hit", "Stand", "Double", "Split", "Blackjack"])
    for(var i = 0; i < n; i++){
        document.getElementById("stand_button").click();
        if(!possible_moves.has(right_move)){
            console.log("ERROR HERE");
            break
        }
        console.log("Iter " + i);
    }
}