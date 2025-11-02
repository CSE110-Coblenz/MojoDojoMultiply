constructor(
		onAnswerClick: (answer: number) => void,
		onAnswerHoverStart: () => void,
		onAnswerHoverEnd: () => void
	)

updateQuestion(num1: number, num2: number, allAnswers: number[]): void {
		this.questionText.text(`${num1} x ${num2} = ?`);

		// Set correct answer (model ensures allAnswers contains it)
		this.correctAnswer = num1 * num2;

		// Update answer texts with provided answers
		this.answerTexts.forEach((text, index) => {
			text.text(`${allAnswers[index] ?? ""}`);
		});

		this.group.getLayer()?.draw();
	}
	
	/**
	 * Get the current correct answer
	 */
	getCorrectAnswer(): number {
		return this.correctAnswer;
	}