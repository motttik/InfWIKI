import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Button } from '@/components/ui/Button'
import { I18nextProvider } from 'react-i18next'
import i18n from '@/i18n'

const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
)

describe('Button', () => {
  it('renders children correctly', () => {
    render(
      <Wrapper>
        <Button>Click me</Button>
      </Wrapper>
    )
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })

  it('applies variant classes', () => {
    const { container } = render(
      <Wrapper>
        <Button variant="secondary">Test</Button>
      </Wrapper>
    )
    expect(container.querySelector('.btn-secondary')).toBeInTheDocument()
  })

  it('applies size classes', () => {
    const { container } = render(
      <Wrapper>
        <Button size="lg">Large</Button>
      </Wrapper>
    )
    expect(container.querySelector('.btn-lg')).toBeInTheDocument()
  })

  it('is disabled when disabled prop is true', () => {
    render(
      <Wrapper>
        <Button disabled>Disabled</Button>
      </Wrapper>
    )
    expect(screen.getByText('Disabled')).toBeDisabled()
  })

  it('calls onClick handler when clicked', () => {
    const handleClick = vi.fn()
    render(
      <Wrapper>
        <Button onClick={handleClick}>Click</Button>
      </Wrapper>
    )
    fireEvent.click(screen.getByText('Click'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('does not call onClick when disabled', () => {
    const handleClick = vi.fn()
    render(
      <Wrapper>
        <Button disabled onClick={handleClick}>
          Disabled
        </Button>
      </Wrapper>
    )
    fireEvent.click(screen.getByText('Disabled'))
    expect(handleClick).not.toHaveBeenCalled()
  })
})
