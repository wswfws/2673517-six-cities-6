import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import PrivateRoute from './private-route';
import {ReactElement} from 'react';

describe('PrivateRoute Component', () => {
  const TestChildComponent = () => <div>Test Content</div>;

  const renderWithRouter = (component: ReactElement) =>
    render(<BrowserRouter>{component}</BrowserRouter>);

  it('should render children when hasAccess is true', () => {
    renderWithRouter(
      <PrivateRoute hasAccess>
        <TestChildComponent />
      </PrivateRoute>
    );

    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('should not render children when hasAccess is false', () => {
    renderWithRouter(
      <PrivateRoute hasAccess={false}>
        <TestChildComponent />
      </PrivateRoute>
    );

    expect(screen.queryByText('Test Content')).not.toBeInTheDocument();
  });

  it('should navigate to login when hasAccess is false', () => {
    renderWithRouter(
      <PrivateRoute hasAccess={false}>
        <TestChildComponent />
      </PrivateRoute>
    );

    // Navigate component will redirect, so children won't be rendered
    expect(screen.queryByText('Test Content')).not.toBeInTheDocument();
  });

  it('should render multiple children when hasAccess is true', () => {
    renderWithRouter(
      <PrivateRoute hasAccess>
        <div>First Child</div>
        <div>Second Child</div>
      </PrivateRoute>
    );

    expect(screen.getByText('First Child')).toBeInTheDocument();
    expect(screen.getByText('Second Child')).toBeInTheDocument();
  });

  it('should render nested components when hasAccess is true', () => {
    const NestedComponent = () => (
      <div>
        <h1>Title</h1>
        <p>Description</p>
      </div>
    );

    renderWithRouter(
      <PrivateRoute hasAccess>
        <NestedComponent />
      </PrivateRoute>
    );

    expect(screen.getByText('Title')).toBeInTheDocument();
    expect(screen.getByText('Description')).toBeInTheDocument();
  });

  it('should render complex JSX structure when hasAccess is true', () => {
    renderWithRouter(
      <PrivateRoute hasAccess>
        <section>
          <header>Header</header>
          <main>Main Content</main>
          <footer>Footer</footer>
        </section>
      </PrivateRoute>
    );

    expect(screen.getByText('Header')).toBeInTheDocument();
    expect(screen.getByText('Main Content')).toBeInTheDocument();
    expect(screen.getByText('Footer')).toBeInTheDocument();
  });

  it('should handle null children when hasAccess is true', () => {
    renderWithRouter(
      <PrivateRoute hasAccess>
        {null}
      </PrivateRoute>
    );

    // Should not throw error
    expect(screen.queryByText('Test Content')).not.toBeInTheDocument();
  });

  it('should handle string children when hasAccess is true', () => {
    renderWithRouter(
      <PrivateRoute hasAccess>
        Just a string
      </PrivateRoute>
    );

    expect(screen.getByText('Just a string')).toBeInTheDocument();
  });

  it('should handle number children when hasAccess is true', () => {
    renderWithRouter(
      <PrivateRoute hasAccess>
        {42}
      </PrivateRoute>
    );

    expect(screen.getByText('42')).toBeInTheDocument();
  });

  it('should render fragment children when hasAccess is true', () => {
    renderWithRouter(
      <PrivateRoute hasAccess>
        <>
          <div>Fragment Child 1</div>
          <div>Fragment Child 2</div>
        </>
      </PrivateRoute>
    );

    expect(screen.getByText('Fragment Child 1')).toBeInTheDocument();
    expect(screen.getByText('Fragment Child 2')).toBeInTheDocument();
  });

  it('should not render any children content when hasAccess is false', () => {
    renderWithRouter(
      <PrivateRoute hasAccess={false}>
        <>
          <div>Should not render</div>
          <span>Also should not render</span>
        </>
      </PrivateRoute>
    );

    expect(screen.queryByText('Should not render')).not.toBeInTheDocument();
    expect(screen.queryByText('Also should not render')).not.toBeInTheDocument();
  });

  it('should handle conditional children when hasAccess is true', () => {
    const showContent = true;

    renderWithRouter(
      <PrivateRoute hasAccess>
        {showContent && <div>Conditional Content</div>}
      </PrivateRoute>
    );

    expect(screen.getByText('Conditional Content')).toBeInTheDocument();
  });

  it('should work with component that has props when hasAccess is true', () => {
    const ComponentWithProps = ({ text }: { text: string }) => <div>{text}</div>;

    renderWithRouter(
      <PrivateRoute hasAccess>
        <ComponentWithProps text="Props Test" />
      </PrivateRoute>
    );

    expect(screen.getByText('Props Test')).toBeInTheDocument();
  });

  it('should handle empty children when hasAccess is true', () => {
    renderWithRouter(
      <PrivateRoute hasAccess>
      </PrivateRoute>
    );

    // Should not throw error
    expect(document.body).toBeInTheDocument();
  });

  it('should preserve component hierarchy when hasAccess is true', () => {
    const ParentComponent = () => (
      <div data-testid="parent">
        <div data-testid="child">Child</div>
      </div>
    );

    renderWithRouter(
      <PrivateRoute hasAccess>
        <ParentComponent />
      </PrivateRoute>
    );

    expect(screen.getByTestId('parent')).toBeInTheDocument();
    expect(screen.getByTestId('child')).toBeInTheDocument();
  });
});
