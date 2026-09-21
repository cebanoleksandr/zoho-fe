import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import { useRegister } from '../../hooks/queries';
import type { RegisterPayload } from '../../types';

const schema = yup.object({
  organizationName: yup.string().required('Organization name is required'),
  firstName: yup.string().required('First name is required'),
  lastName: yup.string().required('Last name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().min(8, 'At least 8 characters').required('Password is required'),
});

type RegisterFormValues = yup.InferType<typeof schema>;

function RegisterPage() {
  const navigate = useNavigate();
  const register_ = useRegister();
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
        {register_.isError && <Alert severity="error">Registration failed. Please try again.</Alert>}
        <TextField
          label="Organization name"
          fullWidth
          {...register('organizationName')}
          error={!!errors.organizationName}
          helperText={errors.organizationName?.message}
        />
        <Stack direction="row" spacing={2}>
          <TextField
            label="First name"
            fullWidth
            {...register('firstName')}
            error={!!errors.firstName}
            helperText={errors.firstName?.message}
          />
          <TextField
            label="Last name"
            fullWidth
            {...register('lastName')}
            error={!!errors.lastName}
            helperText={errors.lastName?.message}
          />
        </Stack>
        <TextField
          label="Email"
          type="email"
          fullWidth
          {...register('email')}
          error={!!errors.email}
          helperText={errors.email?.message}
        />
        <TextField
          label="Password"
          type="password"
          fullWidth
          {...register('password')}
          error={!!errors.password}
          helperText={errors.password?.message}
        />
        <Button type="submit" variant="contained" size="large" disabled={register_.isPending}>
          {register_.isPending ? 'Creating account…' : 'Create account'}
        </Button>
        <Typography variant="body2" align="center">
          Already have an account? <Link component={RouterLink} to="/auth/login">Sign in</Link>
        </Typography>
      </Stack>
    </form>
  );
}

export default RegisterPage;
