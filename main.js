var divHeight = 800;
var divWidth = 800;

var game = new Phaser.Game(divHeight,divWidth,Phaser.CANVAS, 'towerGame');

var imageHeight = 9000;

var cursors;
var ground;

var maxHeight = 0;
var maxHeightText;
var maxHeightTextHandle;
var crate;
var highScore = 0;

var cameraSpeed = 16;
var t_create;



var mainButton;

var titleState = {
    preload: function(){
        //game.load.image('bg','bg3.jpg');

        game.load.image("bg3_upper","bg3_upper.jpg");
        game.load.image("bg3_middle","bg3_middle.jpg");
        game.load.image("bg3_bottom","bg3_bottom.jpg");
    },

    create: function(){
        game.world.setBounds(0,0,800,imageHeight);
        //game.add.sprite(0,0,"bg");

        addBackground();

        game.camera.y = imageHeight;


        var linkTextSize = 50;

        var titleText = game.add.text(150,imageHeight-600,"Build A Tower",{font: "70px Arial Black",fill:"#5959c1",align:"center"});
        titleText.stroke = "#0000FF";
        titleText.strokeThickness = 6;
        
        var startGameText = game.add.text(180,imageHeight-300,"Start game",{font: linkTextSize+"px Arial",fill:"#000000",align:"center"});
        startGameText.inputEnabled = true;
        startGameText.events.onInputDown.add(buttonClickStartGame,this); 
        startGameText.events.onInputOver.add(buttonOverStartGame,this);
        startGameText.events.onInputOut.add(buttonOutStartGame,this);  

        var highscoreText = game.add.text(180,imageHeight-230,"Score",{font: linkTextSize+"px Arial",fill:"#000000",align:"center"});
        highscoreText.inputEnabled = true;
        highscoreText.events.onInputDown.add(buttonClickHighscore,this); 
        highscoreText.events.onInputOver.add(buttonOverStartGame,this);
        highscoreText.events.onInputOut.add(buttonOutStartGame,this);  

        var helpText = game.add.text(180,imageHeight-160,"Help",{font:linkTextSize+"px Arial",fill:"#000000",align:"center"});


        var bottomText = game.add.text(180,imageHeight-30,"Build A Tower v. 1.0",{font:"15px Arial",fill:"#000000"});
    },

    update: function(){

    },
}

function buttonClickStartGame(item){
    game.state.start("gameState");
}

function buttonOverStartGame(item){
    item.fill = "#0000FF";
}


function buttonOutStartGame(item){
    item.fill = "#000000";
}

function buttonClickHighscore(item){
    game.state.start("highscoreState");
}


// HIGH SCORE STATE

var highscoreState = {
    preload: function(){
        game.load.image('bg','bg3.jpg');
    },

    create: function(){

        game.world.setBounds(0,0,800,imageHeight);
        game.add.sprite(0,0,"bg");

        game.camera.y = imageHeight;

        var textBackToMainScreen = game.add.text(150,imageHeight-100,"Back",{font: "50px Arial",fill:"#000000"});
        textBackToMainScreen.inputEnabled = true;
        textBackToMainScreen.events.onInputDown.add(buttonClickBackToMainScreen,this); 
        textBackToMainScreen.events.onInputOver.add(buttonOverStartGame,this);
        textBackToMainScreen.events.onInputOut.add(buttonOutStartGame,this);  

        FB.getLoginStatus(function(response) {
            statusChangeCallback(response);
            if( response.status !== 'connected' ){
                game.add.text(50,imageHeight-800,"Please log in to FB for viewing high score",{font: "30px Arial Black",fill:"#5959c1",align:"center"});

            }
            else{



        


        var linkTextSize = 50;

        var titleText = game.add.text(150,imageHeight-800,"High score",{font: "70px Arial Black",fill:"#5959c1",align:"center"});
        titleText.stroke = "#0000FF";
        titleText.strokeThickness = 6;

        // Load high score from server
        loadHighscoreFromDataBase(function(output){
            var highScoreOffsetY = 500;

            var newLineArray = output.split("\n");

            for(var i=0;i<newLineArray.length-1;i++){
                var lineSplit = newLineArray[i].split(",");
                
                var userID = lineSplit[0];
                var score = lineSplit[1];
                var gameDate = lineSplit[2];


                FB.api('/'+userID,function(response){
                    var fullName = response.name;

                  game.add.text(150,imageHeight-highScoreOffsetY+i*50,fullName+"\t "+score);
                })

                    
                

            }
        });


        



            }
          });

    },

    update: function(){

    }
}

function loadHighscoreFromDataBase(handleData){
    $.ajax({
                type:"GET",
                data:"getHighscore",
                url:"serverSide.php",
                dataType:"text",
                async:false,
                contentType:"text/xml;charset=\"utf-8\"",
                success:function(data){
                    handleData(data);
                }
            });
}

function buttonClickBackToMainScreen(item){
    game.state.start("titleState");
}


var textBackToMainScreen;
var resetGame;
var highscoreText;

var arrowUpButton;
var arrowDownButton;

var arrowUpPressed = false;
var arrowDownPressed = false;




function addBackground(){
            game.add.sprite(0,0,"bg3_upper");
        game.add.sprite(0,2656,"bg3_middle");
        var bottomY = 2656+2832;
        game.add.sprite(0,bottomY,"bg3_bottom");
}

var gameState = {
    preload: function(){
        game.load.image('crate','crate.png');
        //game.load.image('bg','bg3.jpg');
        game.load.image("platform","platform.png");

        game.load.image("bg3_upper","bg3_upper.jpg");
        game.load.image("bg3_middle","bg3_middle.jpg");
        game.load.image("bg3_bottom","bg3_bottom.jpg");

        game.load.image("arrowUp","arrowUp.png");
        game.load.image("arrowDown","arrowDown.png");
        
    },

    create: function(){
        crate = null;


        game.physics.startSystem(Phaser.Physics.P2JS);
        cursors = game.input.keyboard.createCursorKeys();
        game.physics.p2.gravity.y = 250;
        
        game.world.setBounds(0,0,800,imageHeight);

        //game.add.sprite(0,0,"bg");



        addBackground();

        
        arrowUpButton =  game.add.sprite(divWidth-120,imageHeight-divHeight/2-80,"arrowUp");
        arrowDownButton =  game.add.sprite(divWidth-120,imageHeight-divHeight/2+80,"arrowDown");

        arrowUpButton.inputEnabled = true;
        arrowDownButton.inputEnabled = true;

        //arrowUpButton.events.onInputDown.add(arrowUpButtonClicked,this);
        //arrowDownButton.events.onInputDown.add(arrowDownButtonClicked,this);
        
        arrowUpButton.events.onInputDown.add(arrowUpPressedTrue,this);
        arrowUpButton.events.onInputUp.add(arrowUpPressedFalse,this);

        arrowDownButton.events.onInputDown.add(arrowDownPressedTrue,this);
        arrowDownButton.events.onInputUp.add(arrowDownPressedFalse,this);

        

        game.camera.y = imageHeight;

        var ground = game.add.sprite(game.world.centerX,game.world.height-64,"platform");
        ground.scale.setTo(1,1);
        game.physics.p2.enable(ground);
        ground.body.static = true;
        


        
            game.input.onTap.add(addBox,this);

        

        maxHeightText = "Score: "+maxHeight;
        maxHeightTextHandle = game.add.text(10,imageHeight-divHeight,maxHeightText,{font:"30px Arial"});

        
        getUserID(function(userID){
            loadSingleHighScoreFromDataBase(userID);
            highscoreText = game.add.text(200,imageHeight-divHeight,"High score: "+highScore,{font:"30px Arial"});
        })
        



        resetGame = game.add.text(10,imageHeight-divHeight+50,"Reset",{font:"20px Arial"});
        resetGame.inputEnabled = true;
        resetGame.events.onInputDown.add(buttonClickResetGame,this); 
        resetGame.events.onInputOver.add(buttonOverQuitGame,this);
        resetGame.events.onInputOut.add(buttonOutQuitGame,this);  


        textBackToMainScreen = game.add.text(10,imageHeight-divHeight+80,"Quit",{font:"20px Arial"});
        textBackToMainScreen.inputEnabled = true;
        textBackToMainScreen.events.onInputDown.add(buttonClickQuitGame,this); 
        textBackToMainScreen.events.onInputOver.add(buttonOverQuitGame,this);
        textBackToMainScreen.events.onInputOut.add(buttonOutQuitGame,this);  




    },

    update: function(){

        var diff = imageHeight-game.camera.y-maxHeight;

        //console.log(game.input.activePointer.x);


        if(arrowUpPressed==true && diff<600){
            game.camera.y -= cameraSpeed;
            arrowUpButton.position.y -=cameraSpeed;
            arrowDownButton.position.y -=cameraSpeed;
            maxHeightTextHandle.position.y -= cameraSpeed;
            textBackToMainScreen.position.y -= cameraSpeed;
            resetGame.position.y -= cameraSpeed;
            highscoreText.position.y -= cameraSpeed;
        }
        else if(arrowDownPressed==true && game.camera.y<imageHeight-divHeight){
            game.camera.y += cameraSpeed;
            arrowUpButton.position.y +=cameraSpeed;
            arrowDownButton.position.y +=cameraSpeed;
            maxHeightTextHandle.position.y += cameraSpeed;
            textBackToMainScreen.position.y += cameraSpeed;
            resetGame.position.y += cameraSpeed;
            highscoreText.position.y += cameraSpeed;
        }



        if(cursors.up.isDown && diff<600){
            game.camera.y -= cameraSpeed;
            maxHeightTextHandle.position.y -= cameraSpeed;
            textBackToMainScreen.position.y -= cameraSpeed;
            resetGame.position.y -= cameraSpeed;
        }
        else if(cursors.down.isDown && game.camera.y<imageHeight-divHeight){
            game.camera.y += cameraSpeed;
            maxHeightTextHandle.position.y += cameraSpeed;
            textBackToMainScreen.position.y += cameraSpeed;
            resetGame.position.y += cameraSpeed;
        }



        if(crate !=null && Math.abs(crate.body.velocity.y) < 1 && game.time.now-t_create>200 ){

            updateMaxHeight();
        }

    },
}


function arrowUpPressedTrue(){
    arrowUpPressed = true;
}

function arrowUpPressedFalse(){
    arrowUpPressed = false;
}

function arrowDownPressedTrue(){
    arrowDownPressed = true;
}

function arrowDownPressedFalse(){
    arrowDownPressed = false;
}



function buttonClickResetGame(item){
    game.state.start("gameState");
    maxHeight = 0;
}

function buttonClickQuitGame(item){
    game.state.start("titleState");
}

function buttonOverQuitGame(item){
    item.fill = "#0000FF";
}


function buttonOutQuitGame(item){
    item.fill = "#000000";
}

game.state.add("titleState",titleState);
game.state.add("gameState",gameState);
game.state.add("highscoreState",highscoreState);

game.state.start("titleState");



function arrowUpButtonClicked(item){
    game.camera.y -= 15;
}

function arrowDownButtonClicked(item){
    game.camera.y += 15;
}



function updateMaxHeight(){
    var cratePosition = Math.ceil(imageHeight-crate.position.y);




    if(cratePosition>maxHeight){
        maxHeight = cratePosition;
        updateText();



    }
}



function updateHighscore(){
    
    getUserID(function(userID){

        $.ajax({
                type:"GET",
                data:"userID="+userID+"&score="+maxHeight,
                url:"serverSide.php",
                dataType:"text",
                async:false,
                contentType:"text/xml;charset=\"utf-8\"",
                success:function(data){
                   
                }
            });

    });
    
}



function crateContact(body,shapeA,shapeB,equations){
    //updateMaxHeight();
}



function addBox(){


    var pointer = game.input.activePointer;


    if( !(pointer.x>680 && pointer.y>320 && pointer.y<590) ){

        crate = game.add.sprite(pointer.x,game.camera.y+pointer.y,"crate");

        
        t_create = game.time.now;
        
        game.physics.p2.enable(crate);

        crate.body.onBeginContact.add(crateContact,this);

        crate.checkWorldBounds = true;

        crate.events.onOutOfBounds.add(goodbye,this);
    }

    

}

function goodbye(obj){
    if(obj.position.x<0 || obj.position.x>divWidth || obj.position.y>imageHeight-divHeight){
        obj.kill();
    }
}


function loadSingleHighScoreFromDataBase(userID){
    $.ajax({
                type:"GET",
                data:"getSingleHighscore&userID="+userID,
                url:"serverSide.php",
                dataType:"text",
                async:false,
                contentType:"text/xml;charset=\"utf-8\"",
                success:function(data){
                    highScore = data;
                }
            });
}




function updateText(){

    maxHeightText = "Score: "+maxHeight;
    maxHeightTextHandle.text = maxHeightText;
}


var element = document.getElementById("towerGame");
element.addEventListener("mousewheel",MouseWheelHandler,false);

function MouseWheelHandler(e){
    var scrollCameraSpeed = 50;

    var delta =  Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
    if(delta==1){
        var diff = imageHeight-game.camera.y-maxHeight;
        if(diff<600){
            game.camera.y -= scrollCameraSpeed;
            maxHeightTextHandle.position.y -= scrollCameraSpeed;
            textBackToMainScreen.position.y -= scrollCameraSpeed;
            resetGame.position.y -= scrollCameraSpeed;
            highscoreText.position.y -= scrollCameraSpeed;

        }
    }
    else if(delta==-1){
        if(game.camera.y<imageHeight-divHeight){
            game.camera.y += scrollCameraSpeed;
            maxHeightTextHandle.position.y += scrollCameraSpeed;
            textBackToMainScreen.position.y += scrollCameraSpeed;
            resetGame.position.y += scrollCameraSpeed;
            highscoreText.position.y += scrollCameraSpeed;
        }
    }
}

