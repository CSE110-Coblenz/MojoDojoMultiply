import Konva from "konva";
import type { View } from "../types.js";
import { DARK_COLOR, GAMECST } from "../constants.js";

/**
 * MainPageView - Renders the main game screen
 */
export class MainPageView implements View {
	private group: Konva.Group;
    // Konva.Image placeholders for timer digits (minute, tens, ones)
    private readonly timerImageNodes: Konva.Image[] = [];
	private scoreText: Konva.Text;
	private timerText: Konva.Text;
	private roundText: Konva.Text;
	private questionText: Konva.Text;
	private answerTexts: Konva.Text[];
	private correctAnswerText: Konva.Text;
	private incorrectAnswerText: Konva.Text;
	private playerHealthBar: Konva.Rect;
	private opponentHealthBar: Konva.Rect;
	private muteLogoSlash: Konva.Line;
	// Konva image for the player's avatar
	private playerAvatar?: Konva.Image;
	// Konva image for the opponent's avatar
	private opponentAvatar?: Konva.Image;
	// optional key handler for keyboard answer selection
	private keyHandler?: (e: KeyboardEvent) => void;
	private pauseLogo: Konva.Group;
	private playLogo: Konva.RegularPolygon;
	private pauseMenu: Konva.Group;

	
	// constructor for the interface Main page interface
	constructor(
		onAnswerClick: (answer: number) => void,
		pauseResumeGame: () => void,
		onHoverStart: () => void,
		onHoverEnd: () => void,
		onStartClick: () => void,
		onHelpClick: () => void,
		onSkipAhead: () => void,
		onMuteClick: () => void
	) {
		this.group = new Konva.Group({ visible: false });

		//Stage background for Konva Group
		const bg = new Konva.Rect({
			x: 0,
			y: 0,
			width: GAMECST.STAGE_WIDTH,
			height: GAMECST.STAGE_HEIGHT,
			fill: GAMECST.BCKGRD_COLOR
		});
		this.group.add(bg);

		// Score display (bottom-center). origin will be set to the center so
		// the text remains centered as its content changes.
		this.scoreText = new Konva.Text({
			x: GAMECST.STAGE_WIDTH / 2,
			Y: GAMECST.STAGE_HEIGHT - 30,
			text: "Score: 00000",
			fontSize: 40,
			fontFamily: GAMECST.DEFAULT_FONT,
			fill: GAMECST.DARK_COLOR,
		});
		// make origin the visual center
		this.scoreText.offsetX(this.scoreText.width() / 2);
		this.scoreText.offsetY(this.scoreText.height());
		this.group.add(this.scoreText);

		//TODO: Add function that changes the round number
		this.roundText = new Konva.Text({
			x: GAMECST.STAGE_WIDTH - 40,
			y: 35,
			text: "ROUND 1",
			fontSize: 30,
			fontFamily: GAMECST.DEFAULT_FONT,
			fill: GAMECST.DARK_COLOR
		});
		this.roundText.offsetX(this.roundText.width());
		this.roundText.offsetY(this.roundText.height() / 2);
		this.group.add(this.roundText);

		//Group that holds the pause/play button
		//The button allows the user to pause/play the gameplay 
		const pausePlayButtonGroup = new Konva.Group({ 
			visible: true,
			x: 20,
			y: 20
		});
		this.group.add(pausePlayButtonGroup);

		//The background for the button
		const pausePlayBox = new Konva.Rect({
			x: 0,
			y: 0,
			width: 60,
			height: 60,
			stroke: GAMECST.DARK_COLOR,
			strokeWidth: 4,
			fill: GAMECST.NEUTRAL_COLOR
		})
		pausePlayButtonGroup.add(pausePlayBox);

		//Group containing both elements of the pause logo
		this.pauseLogo = new Konva.Group({visible: true});
		pausePlayButtonGroup.add(this.pauseLogo);
		//Change positioning of elements in pause group to be local to the group
		this.pauseLogo.position({x: pausePlayBox.x() + 11, y: pausePlayBox.y() + 11});

		//Left element of the pause logo
		const pauseLogo1 = new Konva.Rect({
			x: 0,
			y: 0,
			width: 14,
			height: 40,
			fill: GAMECST.DARK_COLOR,
			cornerRadius: 4
		});
		this.pauseLogo.add(pauseLogo1);

		//Right element of the pause logo
		const pauseLogo2 = new Konva.Rect({
			x: pauseLogo1.x() + pauseLogo1.width() + 10,
			y: 0,
			width: 14,
			height: 40,
			fill: GAMECST.DARK_COLOR,
			cornerRadius: 4
		});
		this.pauseLogo.add(pauseLogo2);

		//Center the pause logo in the button
		this.pauseLogo.offsetX(this.pauseLogo.width() / 2);
		this.pauseLogo.offsetY(this.pauseLogo.height() / 2);

		// Logo that makes pause/play button play
		this.playLogo = new Konva.RegularPolygon({
			x: 25,
			y: 30,
			sides: 3,
			radius: 25,
			fill: GAMECST.DARK_COLOR,
			rotation: 90,
			visible: false
		});
		pausePlayButtonGroup.add(this.playLogo);

		//Adds the click mouse appearance when hovering
		pausePlayButtonGroup.on('mouseover', onHoverStart);
		pausePlayButtonGroup.on('mouseout', onHoverEnd);

		//Cycles between the play and pause logos when the button is clicked
		pausePlayButtonGroup.on('click tap', () => { pauseResumeGame() });

		const muteButton = new Konva.Group({
			visible: true,
			x: pausePlayButtonGroup.x() + pausePlayBox.width() + 20,
			y: 20
		});
		this.group.add(muteButton);

		//The background for the button
		const muteBox = new Konva.Rect({
			x: 0,
			y: 0,
			width: 60,
			height: 60,
			stroke: GAMECST.DARK_COLOR,
			strokeWidth: 4,
			fill: GAMECST.NEUTRAL_COLOR
		})
		muteButton.add(muteBox);

		const muteLogo = new Konva.Group({ visible: true });
		// position the logo inside the 60x60 button with a small inset
		muteLogo.position({ x: muteBox.x() + 6, y: muteBox.y() + 6 });

		// speaker wedge (filled polygon)
		const speaker = new Konva.Line({
			points: [
				0, 12,  // left top
				10, 12, // inner top
				22, 0,  // tip top
				22, 48, // tip bottom
				10, 36, // inner bottom
				0, 36   // left bottom
			],
			closed: true,
			fill: GAMECST.DARK_COLOR
		});
		muteLogo.add(speaker);

		// sound waves using arcs (stroked, rounded)
		const wave1 = new Konva.Arc({
			x: 16,
			y: 24,
			innerRadius: 15,
			outerRadius: 19,
			angle: 90,
			rotation: -45,
			stroke: GAMECST.DARK_COLOR,
			strokeWidth: 3,
			lineCap: 'round',
			fill: GAMECST.DARK_COLOR
		});
		const wave2 = new Konva.Arc({
			x: 22,
			y: 24,
			innerRadius: 21,
			outerRadius: 25,
			angle: 90,
			rotation: -45,
			stroke: GAMECST.DARK_COLOR,
			strokeWidth: 3,
			lineCap: 'round',
			fill: GAMECST.DARK_COLOR
		});
		muteLogo.add(wave1, wave2);

		// add the composed logo to the button
		muteButton.add(muteLogo);

		this.muteLogoSlash = new Konva.Line({
			points: [2, 2, 46, 46], // diagonal from top-left to bottom-right (backslash)
			stroke: GAMECST.ALERT_COLOR,
			strokeWidth: 8,
			lineCap: 'round',
			lineJoin: 'round',
			visible: false
		});
		muteLogo.add(this.muteLogoSlash);

		//Adds the click mouse appearance when hovering
		muteButton.on('mouseover', onHoverStart);
		muteButton.on('mouseout', onHoverEnd);

		//Cycles between the play and pause logos when the button is clicked
		muteButton.on('click tap', () => { onMuteClick() });



		//Health bar that visualizes the health of the player's character
		const playerHealthGroup = new Konva.Group();
		this.group.add(playerHealthGroup);
		const healthBarWidth = 150;

		//Background to visualize the full size of the health bar
		const playerBarBacking = new Konva.Rect({
			x: 80,
			y: GAMECST.STAGE_HEIGHT * 2 / 3,
			width: healthBarWidth,
			height: 40,
			stroke: GAMECST.DARK_COLOR,
			strokeWidth: 4,
			fill: GAMECST.NEUTRAL_COLOR
		});
		playerHealthGroup.add(playerBarBacking);

		//Health bar that shrinks to model the health level of the player 
		this.playerHealthBar = new Konva.Rect({
			x: playerBarBacking.x() + 2,
			y: playerBarBacking.y() + 2,
			width: healthBarWidth - 4,
			height: 36,
			strokeEnabled: false,
			fill: GAMECST.ALERT_COLOR
		});
		playerHealthGroup.add(this.playerHealthBar);

		//Health bar that visualizes the health of the opponent's character
		const opponentHealthGroup = new Konva.Group();
		this.group.add(opponentHealthGroup);

		//Background to visualize the full size of the health bar
		const opponentBarBacking = new Konva.Rect({
			x: 300,
			y: playerBarBacking.y(),
			width: healthBarWidth,
			height: 40,
			stroke: GAMECST.DARK_COLOR,
			strokeWidth: 4,
			fill: GAMECST.NEUTRAL_COLOR
		});
		opponentHealthGroup.add(opponentBarBacking);

		//Health bar that shrinks to model the health level of the opponent
		this.opponentHealthBar = new Konva.Rect({
			x: opponentBarBacking.x() + 2,
			y: opponentBarBacking.y() + 2,
			width: healthBarWidth - 4,
			height: 36,
			strokeEnabled: false,
			fill: GAMECST.ALERT_COLOR
		});
		opponentHealthGroup.add(this.opponentHealthBar);

		// Initialize health bars to full
		this.updateHealthBars(1, 1);

		//Group that contains all the elements of the fight scene
		const fightingStage = new Konva.Group();
		this.group.add(fightingStage);

		// load boxer image and store it on the instance so other code can access it
		Konva.Image.fromURL('/boxer.png', (image) => {
			// keep a reference to the Konva.Image node
			this.playerAvatar = image;

			// set desired scale and position (adjust values as needed)
			image.scale({ x: 0.3, y: 0.3 });
			image.position({ x: 80, y: GAMECST.STAGE_HEIGHT / 3});

			// add to the fighting stage group
			fightingStage.add(image);
		});

		// load boxer image and store it on the instance so other code can access it
		Konva.Image.fromURL('/boxer2.png', (image) => {
			// keep a reference to the Konva.Image node
			this.opponentAvatar = image;

			// set desired scale and position (adjust values as needed)
			image.scale({ x: 0.3, y: 0.3 });
			image.position({ x: 300, y: GAMECST.STAGE_HEIGHT / 3 });

			// add to the fighting stage group
			fightingStage.add(image);
		});

		// Create four answer squares in a 2x2 grid pattern in the center of the screen
		const squareSize = 80;
		const spacing = 20;
		const totalWidth = (squareSize * 2) + spacing;
		// initial empty values; controller will populate the first question
		const allAnswers: (string | number)[] = ["", "", "", ""];
		
		// Group that holds the question block and all the answer choices.
		// We'll position this group on the right third of the stage and vertically
		// All children coordinates will be relative to the group's origin
		const gameQuestAnsGroup = new Konva.Group();

		//Set the position of the entire group
		gameQuestAnsGroup.position({ x: GAMECST.STAGE_WIDTH * 2 / 3, y: GAMECST.STAGE_HEIGHT / 5, });
		this.group.add(gameQuestAnsGroup);

		//Group that holds the question text and the question box
		const questionGroup = new Konva.Group();
		gameQuestAnsGroup.add(questionGroup);

		// Timer display (top-right)
		this.timerText = new Konva.Text({
			x: totalWidth / 2,
			y: 0,
			text: "Time: 60",
			fontSize: 32,
			fontFamily: GAMECST.DEFAULT_FONT,
			fill: GAMECST.ALERT_COLOR,
		});
		this.timerText.offsetX(this.timerText.width() / 2);
		gameQuestAnsGroup.add(this.timerText);
		
		// The question box sits at the top of the group's local coords
		const questionBox = new Konva.Rect({
			x: 0,
			y: this.timerText.y() + this.timerText.height() + spacing,
			width: totalWidth,
			height: squareSize,
			fill: GAMECST.HIGHLIGHT_COLOR,
			stroke: GAMECST.DARK_COLOR,
			strokeWidth: 4
		});
		questionGroup.add(questionBox);

		//Secret skip ahead a round functionality for testing (I cant do any more times tables...)
		questionBox.on('dblclick', onSkipAhead);

		// Answer 1 (top-left)
		const answer1Group = new Konva.Group();
		gameQuestAnsGroup.add(answer1Group);

		// The box that serves as the background and touch target of answer 1
		const answer1Box = new Konva.Rect({
			x: 0,
			y: questionBox.y() + questionBox.height() + spacing,
			width: squareSize,
			height: squareSize,
			fill: GAMECST.HIGHLIGHT_COLOR,
			stroke: GAMECST.DARK_COLOR,
			strokeWidth: 4
		});
		answer1Group.add(answer1Box);

		// Answer 2 (top-right)
		const answer2Group = new Konva.Group();
		gameQuestAnsGroup.add(answer2Group);

		const answer2Box = new Konva.Rect({
			x: answer1Box.x() + answer1Box.width() + spacing,
			y: questionBox.y() + questionBox.height() + spacing,
			width: squareSize,
			height: squareSize,
			fill: GAMECST.HIGHLIGHT_COLOR,
			stroke: GAMECST.DARK_COLOR,
			strokeWidth: 4
		});
		answer2Group.add(answer2Box);
		
		// Answer 3 (bottom-left)
		const answer3Group = new Konva.Group();
		gameQuestAnsGroup.add(answer3Group);

		const answer3Box = new Konva.Rect({
			x: 0,
			y: answer1Box.y() + answer1Box.height() + spacing,
			width: squareSize,
			height: squareSize,
			fill: GAMECST.HIGHLIGHT_COLOR,
			stroke: GAMECST.DARK_COLOR,
			strokeWidth: 4
		});
		answer3Group.add(answer3Box);

		// Answer 4 (bottom-right)
		const answer4Group = new Konva.Group();
		gameQuestAnsGroup.add(answer4Group);

		const answer4Box = new Konva.Rect({
			x: answer3Box.x() + answer3Box.width() + spacing,
			y: answer2Box.y() + answer2Box.height() + spacing,
			width: squareSize,
			height: squareSize,
			fill: GAMECST.HIGHLIGHT_COLOR,
			stroke: GAMECST.DARK_COLOR,
			strokeWidth: 4
		});
		answer4Group.add(answer4Box);

		//Text that states the what multiplication question is being asked of the user
		this.questionText = new Konva.Text({
			x: questionBox.x() + questionBox.width() / 2,
			y: questionBox.y() + questionBox.height() / 2,
			text: ``,
			fontSize: 30,
			fontFamily: GAMECST.DEFAULT_FONT,
			fill: GAMECST.DARK_COLOR
		});
		// Center the question text within its box
		questionGroup.add(this.questionText);
		
		//Text that shows the user their options for answers to the questions
		this.answerTexts = [
			//The answer in box 1 (upper-left corner)
			new Konva.Text({
				x: answer1Box.x() + answer1Box.width() / 2,
				y: answer1Box.y() + answer1Box.height() / 2,
				text: `${allAnswers[0]}`,
				fontSize: 30,
				fontFamily: GAMECST.DEFAULT_FONT,
				fill: GAMECST.DARK_COLOR
			}),
			//The answer in box 2 (upper-right corner)
			new Konva.Text({
				x: answer2Box.x() + answer2Box.width() / 2,
				y: answer2Box.y() + answer2Box.height() / 2,
				text: `${allAnswers[1]}`,
				fontSize: 30,
				fontFamily: GAMECST.DEFAULT_FONT,
				fill: GAMECST.DARK_COLOR
			}),
			//The answer in box 3 (lower-left corner)
			new Konva.Text({
				x: answer3Box.x() + answer3Box.width() / 2,
				y: answer3Box.y() + answer3Box.height() / 2,
				text: `${allAnswers[2]}`,
				fontSize: 30,
				fontFamily: GAMECST.DEFAULT_FONT,
				fill: GAMECST.DARK_COLOR
			}),
			//The answer in box 4 (lower-right corner)
			new Konva.Text({
				x: answer4Box.x() + answer4Box.width() / 2,
				y: answer4Box.y() + answer4Box.height() / 2,
				text: `${allAnswers[3]}`,
				fontSize: 30,
				fontFamily: GAMECST.DEFAULT_FONT,
				fill: GAMECST.DARK_COLOR
			})
		
		];

		//TODO: add hide and show functionality to this text

		//Text that tells the user they answered correctly
		this.correctAnswerText = new Konva.Text({
			x: totalWidth / 2,
			y: answer3Box.y() + answer3Box.width() + spacing,
			text: "Correct!",
			fill: "green",
			fontSize: 40,
			fontFamily: GAMECST.DEFAULT_FONT,
			visible: false
		});
	
		gameQuestAnsGroup.add(this.correctAnswerText);

		//Center the origin point of the text
		this.correctAnswerText.offsetX(this.correctAnswerText.width() / 2);

		//Text that tells the user they answered correctly
		this.incorrectAnswerText = new Konva.Text({
			x: totalWidth / 2,
			y: answer3Box.y() + answer3Box.width() + spacing,
			text: "Incorrect",
			fill: "red",
			fontSize: 40,
			fontFamily: GAMECST.DEFAULT_FONT,
			visible: false
		});
	
		gameQuestAnsGroup.add(this.incorrectAnswerText);

		//Center the origin point of the text
		this.incorrectAnswerText.offsetX(this.incorrectAnswerText.width() / 2);

		// Attach click/hover handlers now that answerTexts exist
		answer1Group.on('click tap', () => onAnswerClick(parseInt(this.answerTexts[0].text())));
		answer1Group.on('mouseover', onHoverStart);
		answer1Group.on('mouseout', onHoverEnd);


		answer2Group.on('click tap', () => onAnswerClick(parseInt(this.answerTexts[1].text())));
		answer2Group.on('mouseover', onHoverStart);
		answer2Group.on('mouseout', onHoverEnd);

		answer3Group.on('click tap', () => onAnswerClick(parseInt(this.answerTexts[2].text())));
		answer3Group.on('mouseover', onHoverStart);
		answer3Group.on('mouseout', onHoverEnd);

		answer4Group.on('click tap', () => onAnswerClick(parseInt(this.answerTexts[3].text())));
		answer4Group.on('mouseover', onHoverStart);
		answer4Group.on('mouseout', onHoverEnd);

		[answer1Group, answer2Group, answer3Group, answer4Group].forEach((g, i) =>
			g.add(this.answerTexts[i])
		);

		// Keyboard handler: map keys to answer boxes
		// w -> answer 1, e -> answer 2, s -> answer 3, d -> answer 4
		this.keyHandler = (ev: KeyboardEvent) => {
			const key = ev.key.toLowerCase();
			const mapping: Record<string, number> = { w: 0, e: 1, s: 2, d: 3 };
			if (key in mapping) {
				const idx = mapping[key];
				const text = this.answerTexts[idx]?.text();
				const val = parseInt(text);
				if (!Number.isNaN(val)) {
					onAnswerClick(val);
					// optional: brief visual feedback could be added here
				}
			}
		};

		//Menu that appears when you pause the game
		this.pauseMenu = new Konva.Group;
		this.pauseMenu.position({x:20, y:100});
		this.group.add(this.pauseMenu);
		this.pauseMenu.visible(false);

		//Background of the pause screen that prevents the clicking of game buttons
		const pauseScreen = new Konva.Rect({
			x: 0,
			y: 0,
			width: GAMECST.STAGE_WIDTH - 40,
			height: GAMECST.STAGE_HEIGHT - 200,
			fill: GAMECST.UNAVAIL_COLOR,
			stroke: GAMECST.DARK_COLOR,
			strokeWidth: 4,
			opacity: 0.95
		});
		this.pauseMenu.add(pauseScreen);

		//Text that tells the user the game is paused
		const pauseScreenText = new Konva.Text({
			x: pauseScreen.width() / 2,
			y: pauseScreen.height() / 5,
			text: "Game Paused",
			fontSize: 60,
			fontFamily: GAMECST.DEFAULT_FONT,
			fill: DARK_COLOR,
		});
		this.pauseMenu.add(pauseScreenText);

		//Center and add the text to the group
		pauseScreenText.offsetX(pauseScreenText.width() / 2);
		pauseScreenText.offsetY(pauseScreenText.height() / 2);
		this.pauseMenu.add(pauseScreenText);

		//Group containing navigation elements of the pause menu
		const pauseScreenOptions = new Konva.Group({
			x: pauseScreen.width() / 2, 
			y: pauseScreen.height() * 3 / 4
		});
		this.pauseMenu.add(pauseScreenOptions);

		const pauseButtonWidth = 200;
		const pauseButtonSpacing = 80;
		const pauseButtonHeight = 50;
		
		//Center the button group with its size
		pauseScreenOptions.offsetX(pauseButtonWidth + pauseButtonSpacing / 2);
		pauseScreenOptions.offsetY(pauseButtonHeight / 2);

		//Button that takes the user back to the start screen
		//TODO: add navigation function to the button
		const startPageButton = new Konva.Group({});
		pauseScreenOptions.add(startPageButton);

		//Background of the button that is the touch target
		const startPageButtonBackground = new Konva.Rect({
			x: 0,
			y: 0,
			width: 200,
			height: 50,
			stroke: GAMECST.DARK_COLOR,
			strokeWidth: 4,
			fill: GAMECST.HIGHLIGHT_COLOR,
		});
		startPageButton.add(startPageButtonBackground);

		//Text for the start page button to tell the user what it does
		const startPageText = new Konva.Text({
			x: startPageButtonBackground.x() + startPageButtonBackground.width() / 2,
			y: startPageButtonBackground.y() + startPageButtonBackground.height() / 2,
			text: "Main Menu",
			fontSize: 35,
			fontFamily: GAMECST.DEFAULT_FONT,
			fill: DARK_COLOR,
		})
		startPageButton.add(startPageText);

		//Center the button
		startPageText.offsetX(startPageText.width() / 2);
		startPageText.offsetY(startPageText.height() / 2);

		//Button that takes the user back to the start screen
		const helpPageButton = new Konva.Group({});
		pauseScreenOptions.add(helpPageButton);

		//Button that takes the user to the help screen
		const helpPageButtonBackground = new Konva.Rect({
			x: startPageButtonBackground.width() + 80,
			y: 0,
			width: 200,
			height: 50,
			stroke: GAMECST.DARK_COLOR,
			strokeWidth: 4,
			fill: GAMECST.HIGHLIGHT_COLOR,
		});
		helpPageButton.add(helpPageButtonBackground);
		
		//Text for the start page button to tell the user what it does
		const helpPageText = new Konva.Text({
			x: helpPageButtonBackground.x() + helpPageButtonBackground.width() / 2,
			y: helpPageButtonBackground.y() + helpPageButtonBackground.height() / 2,
			text: "Help Page",
			fontSize: 35,
			fontFamily: GAMECST.DEFAULT_FONT,
			fill: DARK_COLOR,
		})
		helpPageButton.add(helpPageText);

		//Center the button
		helpPageText.offsetX(helpPageText.width() / 2);
		helpPageText.offsetY(helpPageText.height() / 2);

		//Add click hover appearance to the help button
		helpPageButton.on('mouseover', onHoverStart);
		helpPageButton.on('mouseout', onHoverEnd);
		helpPageButton.on('click', onHelpClick);

		//Add click hover appearance to the help button
		startPageButton.on('mouseover', onHoverStart);
		startPageButton.on('mouseout', onHoverEnd);
		startPageButton.on('click', onStartClick);

		//Cycles between the play and pause logos when the button is clicked
		//startPageButton.on('click tap', () => { onStartPageClick() });
	}

	/**
	 * Internal method to update score text
	 */
	setScoreText(scoreText: string): void {
		this.scoreText.text(scoreText);
		// update origin so the text remains centered as width/height change
		// this.scoreText.offsetX(this.scoreText.width() / 2);
		// this.scoreText.offsetY(this.scoreText.height() / 2);
		// keep positioned at bottom-center
		// this.scoreText.position({ x: GAMECST.STAGE_WIDTH / 2, y: GAMECST.STAGE_HEIGHT - 30 });
		this.group.getLayer()?.draw();
	}
	

	/**
	 * Internal method to update timer text
	 */
	setTimerText(timerText: string): void {
		this.timerText.text(timerText);
		this.group.getLayer()?.draw();
	}

	/**
	 * Sets the round number text to be the current round
	 */
	setRoundNumber(round: number) {
		this.roundText.text("Round " + round);
	}

	/**
	 * Internal method to update question display
	 */
	setQuestionDisplay(questionText: string, answers: (string | number)[]): void {
		this.questionText.text(questionText);
		// Recenter the question text after changing it
		this.questionText.offsetX(this.questionText.width() / 2);
		this.questionText.offsetY(this.questionText.height() / 2)
		
		this.answerTexts.forEach((text, index) => {
			text.text(`${answers[index] ?? ""}`);
			text.offsetX(text.width() / 2);
			text.offsetY(text.height() / 2);
		});
		this.group.getLayer()?.draw();
	}


    show(): void {
		this.group.visible(true);
		// register keyboard handler when view is shown
		if (this.keyHandler) {
			// remove any existing to avoid duplicates, then add
			window.removeEventListener('keydown', this.keyHandler as EventListener);
			window.addEventListener('keydown', this.keyHandler as EventListener);
		}
		this.group.getLayer()?.draw();
    }

	/**
	 * Hide the screen
	 */
	hide(): void {
		this.group.visible(false);
		// unregister keyboard handler when view is hidden
		if (this.keyHandler) {
			window.removeEventListener('keydown', this.keyHandler as EventListener);
		}
		this.group.getLayer()?.draw();
	}

    getGroup(): Konva.Group {
        return this.group;
    }

    /**
     * Expose the Konva image nodes so controller/model can set their image sources.
     * The view intentionally does not contain timing logic or DOM elements.
     */
    getTimerImageNodes(): Konva.Image[] {
        return this.timerImageNodes;
    }

	/**
	 * Internal function that shows the 'Correct!' text when the user answers correctly
	 */
	correctAnswer(): void {
		this.incorrectAnswerText.visible(false);
		this.correctAnswerText.visible(true);
	}

	/**
	 * Internal function that shows the 'Incorrect' text when the user answers incorrectly
	 */
	incorrectAnswer(): void {
		this.correctAnswerText.visible(false);
		this.incorrectAnswerText.visible(true);
	}

	/**
	 * Hides both the correct and incorrect texts at the end of the game
	 */
	hideCorrectIncorrect(): void {
		this.correctAnswerText.visible(false);
		this.incorrectAnswerText.visible(false);
	}

	/**
	 * Switches the play pause button to the play button config
	 */
	showPlayButton(): void {
		this.pauseLogo.visible(false);
		this.playLogo.visible(true);
		this.pauseMenu.visible(true);
	}

	/**
	 * Switches the play pause button to the play button config
	 */
	showPauseButton(): void {
		this.playLogo.visible(false);
		this.pauseLogo.visible(true);
		this.pauseMenu.visible(false);
	}

	/**
	 * 
	 */
	showMute(): void {
		this.muteLogoSlash.visible(true);
	}

	/**
	 * 
	 */
	showUnmute(): void {
		this.muteLogoSlash.visible(false);
	}

    /**
     * Update the health bars with new percentage values
	 * @param playerHealthPercent The percentage of health for the player (0-1)
	 * @param opponentHealthPercent The percentage of health for the opponent (0-1)
	 * @returns void
     */
    updateHealthBars(playerHealthPercent: number, opponentHealthPercent: number): void {
        const healthBarWidth = 150;
        this.playerHealthBar.width((healthBarWidth - 4) * playerHealthPercent);
        this.opponentHealthBar.width((healthBarWidth - 4) * opponentHealthPercent);
        this.group.getLayer()?.draw();
    }
}