import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import { useLogin } from '../../hooks/queries';
import type { LoginPayload } from '../../types';

function LoginPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const login = useLogin();

  const schema = yup.object({
    email: yup.string().email(t('auth.validation.emailInvalid')).required(t('auth.validation.emailRequired')),
    password: yup.string().required(t('auth.validation.passwordRequired')),
  });

  type LoginFormValues = yup.InferType<typeof schema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({ resolver: yupResolver(schema) });

  const onSubmit = (payload: LoginFormValues) => {
    login.mutate(payload as LoginPayload, {
      onSuccess: () => navigate('/app', { replace: true }),
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <Stack spacing={2}>
        {login.isError && <Alert severity="error">{t('auth.invalidCredentials')}</Alert>}
        <TextField
          label={t('auth.email')}
          type="email"
          fullWidth
          {...register('email')}
          error={!!errors.email}
          helperText={errors.email?.message}
        />
        <TextField
          label={t('auth.password')}
          type="password"
          fullWidth
          {...register('password')}
          error={!!errors.password}
          helperText={errors.password?.message}
        />
        <Button type="submit" variant="contained" size="large" disabled={login.isPending}>
          {login.isPending ? t('auth.signingIn') : t('auth.signIn')}
        </Button>
        <Typography variant="body2" align="center">
          {t('auth.noAccount')} <Link component={RouterLink} to="/auth/register">{t('auth.signUp')}</Link>
        </Typography>
      </Stack>
    </form>
  );
}

export default LoginPage;
