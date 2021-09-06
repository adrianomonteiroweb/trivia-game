import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
  actionGetApiTriviaWithThunk,
  actionChangeIndex,
  actionChangeCurrentQuestion,
} from '../actions';

class BoardQuestions extends React.Component {
  constructor(props) {
    super(props);

    this.fetchApiAndState = this.fetchApiAndState.bind(this);
    this.setQuestionState = this.setQuestionState.bind(this);
    this.handleClick = this.handleClick.bind(this);

    this.state = {
      isLoading: true,
      numberOfClicks: 0,
      buttonNxtQst: false,
      correctAnswer: '3',
      incorrectAnswers: ['4', '5'],
      question: '2',
      category: '1',
    };
  }

  componentDidMount() {
    this.fetchApiAndState();
  }

  setQuestionState() {
    const { isLoading, currentQuestion } = this.props;
    const { numberOfClicks } = this.state;
    const NUMBER_MAX = 4;

    this.setState({
      question: currentQuestion.question,
      category: currentQuestion.category,
      correctAnswer: currentQuestion.correct_answer,
      incorrectAnswers: currentQuestion.incorrect_answers,
    });

    this.setState({ isLoading, numberOfClicks: numberOfClicks + 1 });

    if (numberOfClicks === NUMBER_MAX) {
      this.setState({ buttonNxtQst: true });
    }
  }

  async fetchApiAndState() {
    const { fetchAPI } = this.props;

    await fetchAPI();
    this.setQuestionState();
  }

  async handleClick() {
    const { changeIndex, changeQuestion } = this.props;
    await changeIndex();
    await changeQuestion();
    this.setQuestionState();
  }

  render() {
    const { isLoading,
      buttonNxtQst, correctAnswer, incorrectAnswers, category, question } = this.state;
    if (isLoading) return <h1>Estamos procurando perguntas para você</h1>;
    return (
      <div>
        <div>
          <h2 data-testid="question-category">{category}</h2>
          <h1 data-testid="question-text">{question}</h1>
          <button type="button" data-testid="correct-answer">{correctAnswer}</button>
          {incorrectAnswers.map((answer, index) => (
            <button
              key={ index }
              type="button"
              data-testid={ `wrong-answer-${index}` }
            >
              {answer}
            </button>
          ))}
        </div>
        <button
          onClick={ this.handleClick }
          type="button"
          disabled={ buttonNxtQst }
        >
          Next Question
        </button>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  fetchAPI: () => dispatch(actionGetApiTriviaWithThunk()),
  changeIndex: () => dispatch(actionChangeIndex()),
  changeQuestion: () => dispatch(actionChangeCurrentQuestion()),
});

const mapStateToProps = (state) => ({
  currentQuestion: state.game.currentQuestion,
  isLoading: state.game.isLoading,
});

BoardQuestions.propTypes = {
  fetchAPI: PropTypes.func,
  allQuestions: PropTypes.arrayOf(),
}.isRequired;

export default connect(mapStateToProps, mapDispatchToProps)(BoardQuestions);
