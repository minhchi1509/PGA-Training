import { Checkbox, Radio } from 'antd';
import { useMemo } from 'react';
import Collapse from 'src/components/collapse';
import { BaseText } from 'src/components/typography';
import { TAnswerQuestion, TGetHomeworkResultResponse } from 'src/interfaces/clients-interface';
import { convertHtmlTextToPlain } from 'src/utils/common-utils';
import { EHomeworkResultStatus, EQuestionType, EQuestionViewType } from 'src/variables/enum-variables';
import ActivityCard from './ActivityCard';
import './QuestionResults.scss';
import SeverityTable from './SeverityTable';
import SummaryTable from './SummaryTable';

interface IProps {
  homework?: TGetHomeworkResultResponse;
}

const QuestionResults = ({ homework }: IProps) => {
  const isSpecialQuestion = homework?.result;

  const questionAndAnswers = useMemo(() => {
    const questions = [...(homework?.homeworkQuestions ?? [])];
    const sortedAnswers: TAnswerQuestion[] = [];
    const answerQuestions = homework?.clientResponse?.answerQuestion ?? [];
    const sortedQuestions = questions.sort((a, b) => a.index - b.index) ?? [];
    const formattedQuestions = isSpecialQuestion
      ? sortedQuestions.filter((question) => question.type !== EQuestionViewType.PHOTO)
      : sortedQuestions.filter((question) => question.type === EQuestionViewType.QUESTION);
    const filteredQuestionsIds = formattedQuestions.map((item) => item.id);
    const questionList = isSpecialQuestion
      ? sortedQuestions.filter((question) => question.type === EQuestionViewType.QUESTION)
      : [];

    filteredQuestionsIds.forEach((id) => {
      const item = answerQuestions.find((answer) => answer.questionId === id);
      item && sortedAnswers.push(item);
    });

    const questionAndAnswerList =
      filteredQuestionsIds?.map((id, index) => {
        const question = formattedQuestions[index];
        const answer = sortedAnswers[index];

        return {
          id,
          question: question.question,
          order: index + questionList?.length - formattedQuestions?.length + 1,
          type: question.questionType,
          viewType: question.type,
          options: question.options,
          answerText: answer?.answerText,
          answerChoices: answer?.answerChoices,
          title: question.title,
          description: question.description,
        };
      }) ?? [];

    return questionAndAnswerList;
  }, [homework]);

  return (
    <div className="QuestionResults">
      {!isSpecialQuestion && homework?.status !== EHomeworkResultStatus.SKIPPED && (
        <ActivityCard
          isCard={false}
          data={{ title: 'Homework result', id: homework?.id ?? '' }}
          className="QuestionResults__result"
        >
          {questionAndAnswers.length &&
            questionAndAnswers.map((item, index: number) => {
              return (
                <div className="QuestionResults__QA" key={item.id}>
                  <BaseText type="button" className="QuestionResults__QA-question">
                    {index + 1}. {convertHtmlTextToPlain(item.question ?? '')}
                  </BaseText>

                  <div className="QuestionResults__QA-result">
                    {item.answerText && (
                      <BaseText className="QuestionResults__QA-answerText">{item.answerText}</BaseText>
                    )}
                    {item.answerChoices && (
                      <div className="QuestionResults__QA-answerChoices">
                        {Object.keys(item.options)?.map((key) => (
                          <>
                            {item.type === EQuestionType.MULTI_CHOICE && (
                              <Checkbox checked={item.answerChoices.includes(key)} disabled>
                                {item.options[key]}
                              </Checkbox>
                            )}
                            {item.type === EQuestionType.SINGLE_CHOICE && (
                              <Radio checked={item.answerChoices.includes(key)} disabled>
                                {item.options[key]}
                              </Radio>
                            )}
                          </>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
        </ActivityCard>
      )}

      {isSpecialQuestion && (
        <>
          <ActivityCard
            isCard={false}
            data={{ title: 'Homework result', id: homework?.id ?? '' }}
            className="QuestionResults__result"
          >
            <div className="QuestionResults__scores">
              <div className="QuestionResults__scores-table summary">
                <BaseText type="caption">Result</BaseText>
                <SummaryTable data={homework?.result?.summary} />
              </div>
              <div className="QuestionResults__scores-table">
                <BaseText type="caption">Severity</BaseText>
                <SeverityTable data={homework?.result?.severity} />
              </div>
            </div>
          </ActivityCard>

          <Collapse
            defaultActiveKey={['item']}
            className="QuestionResults__collapse"
            items={[
              {
                key: 'item',
                header: (
                  <div className="QuestionResults__collapse-header">
                    <BaseText inline type="title">
                      Client&apos;s Responses
                    </BaseText>
                    <BaseText inline type="caption">
                      Expand/Collapse
                    </BaseText>
                  </div>
                ),
                content:
                  questionAndAnswers.length &&
                  questionAndAnswers.map((item) => {
                    if (item.viewType === EQuestionViewType.FORM_HEADER)
                      return (
                        <div key={item.id} className="QuestionResults__QA-formHeader">
                          <BaseText
                            dangerouslyText={item.title ?? ''}
                            type="body2"
                            className="QuestionResults__QA-formHeader-title"
                          />
                          <div
                            dangerouslySetInnerHTML={{ __html: item.description ?? '' }}
                            className="QuestionResults__QA-formHeader-description"
                          />
                        </div>
                      );

                    return (
                      <div className="QuestionResults__QA-item" key={item.id}>
                        <div className="QuestionResults__QA-item-label">
                          <BaseText inline>{item.order}.&nbsp;</BaseText>
                          <BaseText dangerouslyText={item.question ?? ''} inline />
                        </div>
                        <div className="QuestionResults__QA-item-value">
                          {item.answerChoices &&
                            Object.keys(item.options)?.map((key) => (
                              <div
                                className={`QuestionResults__QA-item-value-option ${
                                  item.answerChoices.includes(key) ? 'checked' : ''
                                }`}
                                key={key}
                              >
                                {item.options[key]}
                              </div>
                            ))}
                        </div>
                      </div>
                    );
                  }),
              },
            ]}
          />
        </>
      )}
    </div>
  );
};

export default QuestionResults;
