import {useDispatch} from 'react-redux';
import {useNavigate} from 'react-router-dom';
import {loginAction} from '../../store/api-actions';
import Header from '../../components/widgets/header.tsx';
import {FormEvent, useEffect, useState} from 'react';
import {AppDispatch} from '../../store';
import {ROUTE_CONFIG} from '../../components/app/use-app-routes.ts';
import {useAuthorizationStatus} from "../../store/hooks.ts";

export default function LoginPage() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const authorizationStatus = useAuthorizationStatus();

  useEffect(() => {
    if (authorizationStatus === 'AUTH') {
      navigate(ROUTE_CONFIG.ROOT);
    }
  }, [authorizationStatus, navigate]);

  const handleSubmit = (evt: FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(evt.currentTarget);
    const authData = {
      email: formData.get('email') as string,
      password: formData.get('password') as string,
    };

    dispatch(loginAction(authData)).unwrap()
      .then(() => {
        navigate(ROUTE_CONFIG.ROOT);
      })
      .catch((err: string) => {
        setError(err);
      }).finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <div className='page page--gray page--login'>
      <Header/>

      <main className='page__main page__main--login'>
        <div className='page__login-container container'>
          <section className='login'>
            <h1 className='login__title'>Sign in</h1>
            <form
              className='login__form form'
              onSubmit={handleSubmit}
              method='post'
            >
              <div className='login__input-wrapper form__input-wrapper'>
                <label className='visually-hidden'>E-mail</label>
                <input
                  className='login__input form__input'
                  type='email'
                  name='email'
                  placeholder='Email'
                  required
                />
              </div>
              <div className='login__input-wrapper form__input-wrapper'>
                <label className='visually-hidden'>Password</label>
                <input
                  className='login__input form__input'
                  required
                  type='password'
                  name='password'
                  placeholder='Password'
                />
              </div>
              {error && <div style={{color: 'red'}}>{error}</div>}
              <button
                className='login__submit form__submit button'
                type='submit'
                disabled={isLoading}
              >
                {isLoading ? 'Signing in...' : 'Sign in'}
              </button>
            </form>
          </section>
          <section className='locations locations--login locations--current'>
            <div className='locations__item'>
              <a className='locations__item-link' href='#'>
                <span>Amsterdam</span>
              </a>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
