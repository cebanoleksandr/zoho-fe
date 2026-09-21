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
import { useRegister } from '../../hooks/queries';
import type { RegisterPayload } from '../../types';

function RegisterPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const register_ = useRegister();

  const schema = yup.object({
    organizationName: yup.string().required(t('auth.validation.organizationNameRequired')),
    firstName: yup.string().required(t('auth.validation.firstNameRequired')),
    lastName: yup.string().required(t('auth.validation.lastNameRequired')),
    email: yup.string().email(t('auth.validation.emailInvalid')).required(t('auth.validation.emailRequired')),
    password: yup
      .string()
      .min(8, t('auth.validation.passwordMinLength'))
      .required(t('auth.validation.passwordRequired')),
  });

  type RegisterFormValues = yup.InferType<typeof schema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({ resolver: yupResolver(schema) });

  const onSubmit = (payload: RegisterFormValues) => {
    register_.mutate(payload as RegisterPayload, {
      onSuccess: () => navigate('/app', { replace: true }),
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <Stack spacing={2}>
        {register_.isError && <Alert severity="error">{t('auth.registrationFailed')}</Alert>}
        <TextField
          label={t('auth.organizationName')}
          fullWidth
          {...register('organizationName')}
          error={!!errors.organizationName}
          helperText={errors.organizationName?.message}
        />
        <Stack direction="row" spacing={2}>
          <TextField
            label={t('auth.firstName')}
            fullWidth
            {...register('firstName')}
            error={!!errors.firstName}
            helperText={errors.firstName?.message}
          />
          <TextField
            label={t('auth.lastName')}
            fullWidth
            {...register('lastName')}
            error={!!errors.lastName}
            helperText={errors.lastName?.message}
          />
        </Stack>
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
        <Button type="submit" variant="contained" size="large" disabled={register_.isPending}>
          {register_.isPending ? t('auth.creatingAccount') : t('auth.createAccount')}
        </Button>
        <Typography variant="body2" align="center">
          {t('auth.haveAccount')} <Link component={RouterLink} to="/auth/login">{t('auth.signIn')}</Link>
        </Typography>
      </Stack>
    </form>
  );
}

export default RegisterPage;
