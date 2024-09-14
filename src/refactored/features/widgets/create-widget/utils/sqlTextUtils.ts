import { WidgetFilter, WidgetFilterType } from '../types'

export function extractVariables(query: string): WidgetFilter[] {
  const queryWithNoSingleLineComments = removeSingleLineCommentsFromSQL(query)

  const queryWithNoComments = removeMultiLineCommentsFromSQL(
    queryWithNoSingleLineComments
  )

  const regex =
    /(\b[\w.]+\b)\s*(<|>|<=|>=|=|<>|!=|between)\s*\{\{([^{}]+)\}\}/gi

  const variables: WidgetFilter[] = []

  let match
  while ((match = regex.exec(queryWithNoComments)) !== null) {
    const fieldToBeMapped = match[1]
    const comparisonOperator = match[2] ? match[2].trim() : ''
    const variableName = match[3]

    let type: WidgetFilterType = 'text'

    if (comparisonOperator && comparisonOperator.toLowerCase() === 'between') {
      const betweenRegex = /{{([^{}]+)}}\s*and\s*{{([^{}]+)}}/i

      const betweenMatch = betweenRegex.exec(
        queryWithNoComments.substring(match.index)
      )

      if (betweenMatch) {
        type = 'range'
        if (
          fieldToBeMapped.toLowerCase().includes('date') ||
          fieldToBeMapped.toLowerCase().includes('time')
        ) {
          type = 'date_range'
        }

        variables.push({
          variableName,
          fieldToBeMapped,
          type,
          defaultValue: (type === 'date_range'
            ? [undefined, undefined]
            : type === 'range'
              ? [0, 10]
              : '') as any,
        })
      }
    } else {
      if (
        fieldToBeMapped.toLowerCase().includes('date') ||
        fieldToBeMapped.toLowerCase().includes('time')
      ) {
        type = 'date'
      }
      variables.push({
        variableName,
        fieldToBeMapped,
        type,
        defaultValue: (type === 'date' || type === 'text'
          ? undefined
          : '') as any,
      })
    }
  }
  return variables
}

function removeMultiLineCommentsFromSQL(query: string) {
  const queryWithNoMultilineComments = []
  let pushStartIndex = 0
  for (let i = 0; i < query.length; i++) {
    const currentChar = query[i]
    const nextChar = query[i + 1]
    const isMultiLineCommentStarted = currentChar + nextChar === '/*'
    if (isMultiLineCommentStarted) {
      // then start searching if the multiline comment ends
      let j = i
      while (j < query.length) {
        const currentChar = query[j]
        const nextChar = query[j + 1]
        const isMultiLineCommentEnded = currentChar + nextChar === '*/'
        if (isMultiLineCommentEnded) {
          // save the first part from the start index until where the multi line comment started
          queryWithNoMultilineComments.push(query.slice(pushStartIndex, i))
          // reset the push start index to where the multi line comment ends
          pushStartIndex = j + '*/'.length
          // reset the search index to the end where multiline comment ends, in search of new multiline comment
          i = j + '*/'.length
          break
        }
        j++
      }
    }
  }
  // take whatever the end is remaining after the multiline comment ends or if it never starts or never ends
  queryWithNoMultilineComments.push(query.slice(pushStartIndex))
  return queryWithNoMultilineComments.join('')
}

function removeSingleLineCommentsFromSQL(query: string) {
  return query
    .split('\n')
    .map((sqlLine) => {
      if (sqlLine.includes('--')) {
        return sqlLine.split('--')?.[0] || ''
      }
      return sqlLine
    })
    .join('')
}
