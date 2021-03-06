import React from 'react'
import styled from 'styled-components'
import { theme, Text } from '@aragon/ui'
import { noop } from '../utils'
import { lerp } from '../math-utils'
import TemplateCard from './TemplateCard'

class Template extends React.Component {
  static defaultProps = {
    warm: false,
    positionProgress: 0,
    onSelect: noop,
  }
  handleTemplateSelect = template => {
    this.props.onSelect(template)
  }
  render() {
    const { positionProgress, warm, templates, activeTemplate } = this.props
    return (
      <Main>
        <Content
          style={{
            transform: `translateX(${lerp(positionProgress, 0, 50)}%)`,
            opacity: 1 - Math.abs(positionProgress),
            willChange: warm ? 'opacity, transform' : 'auto',
          }}
        >
          <TemplateContent
            templates={templates}
            activeTemplate={activeTemplate}
            handleTemplateSelect={this.handleTemplateSelect}
          />
        </Content>
      </Main>
    )
  }
}

class TemplateContent extends React.PureComponent {
  render() {
    return (
      <React.Fragment>
        <Title>
          <Text size="great" weight="bold" color={theme.textDimmed}>
            Create a new organization
          </Text>
        </Title>

        <p>
          <Text size="large" color={theme.textSecondary}>
            Choose a template to get started
          </Text>
        </p>

        <Templates>
          {[...this.props.templates.entries()].map(
            ([template, { label, icon }], i) => (
              <TemplateCardWrapper key={i}>
                <TemplateCard
                  template={template}
                  icon={icon}
                  label={label}
                  active={template === this.props.activeTemplate}
                  onSelect={this.props.handleTemplateSelect}
                />
              </TemplateCardWrapper>
            )
          )}
        </Templates>
      </React.Fragment>
    )
  }
}

const Main = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: center;
  width: 100%;
  height: 100%;
  padding: 100px;
  padding-top: 140px;
`

const Content = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

const Title = styled.h1`
  font-size: 37px;
  margin-bottom: 40px;
`

const Templates = styled.div`
  display: flex;
  margin-top: 50px;
`

const TemplateCardWrapper = styled.div`
  & + & {
    margin-left: 25px;
  }
`

export default Template
