'use strict';
{
    class Quiz {
        constructor(quizData) {
            this._quizzes = quizData;
            this._correctAnswersNum = 0;
        }
        
        // APIを取得の間のブラウザ描画
        static displayWaiting() {
            const title = document.getElementById('title');
            title.textContent = '取得中';
            const message = document.getElementById('message');
            message.textContent = '少々お待ちください';
        } 
        
        // 問題のカテゴリーを返す関数
        getQuizCategory(index) {
            return this._quizzes[index - 1].category;
        }
        
        // 問題の難易度を返す関数
        getQuizDificult(index) {
            return this._quizzes[index-1].difficulty;
        }
        
        // 問題文を返す関数
        getQuizQuestion(index) {
            return this._quizzes[index-1].question;
        }

        // 正解の選択肢を返す関数
        getQuizCorrectAnswer(index) {
            return this._quizzes[index-1].correct_answer;
        }

        // 正解数が何問あるか返す。
        getCorrectAnswerNum() {
            return this._correctAnswersNum;
        }
    }

    // 選択肢を取得してシャッフルする関数 選択肢の配列を返す
    const getOptions = (index, quiz) => {
        const options = quiz._quizzes[index-1].incorrect_answers; // 不正解3つの配列を格納
        options.push(quiz._quizzes[index-1].correct_answer); //正解を1つ配列に追加
        // optionsをシャッフル
        for (let i = options.length - 1; 0 <= i; i--) {
            const randomNumber = Math.floor(Math.random() * options.length); //0-3までの乱数を生成
            const tmp = options[i]; //index番目の配列要素を退避
            //index番目の配列要素と、randumNumber目の配列要素を入れ替える。
            options[i] = options[randomNumber]; 
            options[randomNumber] = tmp;            
        }
        return options; //選択肢の配列を返す。
    }

    // 結果を表示する関数
    const showResult = (quiz) => {
        const elements = getElements();
        const button = document.createElement('button');
        elements.title.textContent = `あなたの正解数は${quiz.getCorrectAnswerNum()}です!!`; //正解数を描画
        elements.message.textContent = '再度チャンレンジしたい場合は以下をクリック!!'; //ホームボタンを促すコメントを描画
        elements.quizInformation.textContent = ''; //問題の難易度とジャンルを削除する。
        elements.buttonArea.textContent = ''; //問10で描画されているボタンを削除
        button.textContent = 'ホームに戻る'; 
        elements.buttonArea.appendChild(button); 
        // ホームに戻るボタンをクリックすると、リロードされるイベントを追加
        button.addEventListener('click', ()=>{
            location.reload();
        });
    }

    //HTMLのDOMを取得
    const getElements = () => {
        const elements = {
            title:  document.getElementById('title'),
            genre:  document.getElementById('genre'),
            level:  document.getElementById('level'),
            message:  document.getElementById('message'),
            quizInformation: document.getElementById('quizInformation'),
            buttonArea: document.getElementById('buttonArea'),
        };
        return elements;
    }

    // 問題の正解ボタンを作成する関数
    const createAnswerButton = (index, quiz) => {
        const elements = getElements();
        const options = getOptions(index, quiz); //問題の回答の選択肢を取得
        // buttonArea = document.getElementById('buttonArea');
        elements.buttonArea.innerHTML = ''; //前回の問題のボタンを削除
        // 回答の選択肢ボタンの描画とクリックしたときに発生するイベントを追加
        options.forEach((e, i) => {
            //ボタンを作成
            const button = document.createElement('button'); 
            button.setAttribute('id', `answer${i}`); 
            button.setAttribute('class','button');
            button.textContent = e;
            elements.buttonArea.appendChild(button); 
            // イベントを追加
            button.addEventListener('click', ()=>{
                if (e === quiz.getQuizCorrectAnswer(index)) { //正解の場合、カウントアップ
                    quiz._correctAnswersNum++;
                } 

                if (index === 10) { //問10まで来たら結果表示
                    showResult(quiz);
                } else {
                    showQuiz(index + 1, quiz);
                }
            });
        });
    }; //createAnswerButton

    // 問題をブラウザ上に描画する関数
    const showQuiz = (index, quiz) => {
        const elements = getElements();
        elements.title.textContent = `問題${index}`; //何問目か表示
        elements.genre.textContent = `[ジャンル]${quiz.getQuizCategory(index)}`; //ジャンルを表示
        elements.level.textContent = `[難易度]${quiz.getQuizDificult(index)}` //レベルを表示
        elements.textContent = quiz.getQuizQuestion(index); //問題文を表示
        createAnswerButton(index, quiz); //解答ボタン作成
    } //showQuiz

    // 問題を、サイトから取得する関数
    const callAPI = async () => {
        Quiz.displayWaiting(); //取得中の表示をブラウザに描画
        try {
            const response = await fetch('https://opentdb.com/api.php?amount=10');
            const json = await response.json();
            const quizData = json.results;
            const quiz = new Quiz(quizData);
            showQuiz(1, quiz); //問題1を作成
        } catch(error) {
            console.error(error);
        }
    }

    // スタートボタンがクリックされたら発生するイベント
    document.getElementById('start').addEventListener('click', ()=>{
        callAPI();
    })

}