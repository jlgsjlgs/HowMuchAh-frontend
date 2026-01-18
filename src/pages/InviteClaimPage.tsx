import { useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { GalleryVerticalEnd, UserPlus, CheckCircle2, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { invitationLinkQueries } from '@/services/invitationLinks/queries';
import { invitationLinkMutations } from '@/services/invitationLinks/mutations';
import { claimInvitationLinkSchema, type claimInvitationLinkFormData } from '@/schemas/invitationLinkSchemas';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function InviteClaimPage() {
  const { linkId } = useParams<{ linkId: string }>();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [claimStatus, setClaimStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [countdown, setCountdown] = useState(5);

  // Validate link on mount
  const {
    data: validationResult,
    isLoading: validating,
    isError: validationError,
  } = useQuery({
    queryKey: ['validate-invitation-link', linkId, token],
    queryFn: () => invitationLinkQueries.validate(linkId!, token!),
    enabled: !!linkId && !!token,
    retry: false,
  });

  // Form setup
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<claimInvitationLinkFormData>({
    resolver: zodResolver(claimInvitationLinkSchema),
  });

  // Pre-fill email if user is authenticated
  useEffect(() => {
    if (user?.email) {
      setValue('invitedEmail', user.email);
    }
  }, [user, setValue]);

  // Claim invitation mutation
  const { mutate: claimInvitation, isPending: claiming } = useMutation({
    mutationFn: (email: string) =>
      invitationLinkMutations.claim({
        linkId: linkId!,
        token: token!,
        email,
      }),
    onSuccess: () => {
      toast.success('Successfully invited into the group!');
      setClaimStatus('success');
      setCountdown(5);
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || 'Failed to claim invitation');
      setClaimStatus('error');
      setCountdown(5);
    },
  });

  // Countdown and redirect logic
  useEffect(() => {
    if (claimStatus !== 'idle' && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
    
    if (claimStatus !== 'idle' && countdown === 0 && !authLoading) {
      if (user) {
        navigate('/dashboard', { replace: true });
      } else {
        navigate('/login', { replace: true });
      }
    }
  }, [claimStatus, countdown, user, authLoading, navigate]);

  const onSubmit = (data: claimInvitationLinkFormData) => {
    claimInvitation(data.invitedEmail);
  };

  // Loading state
  if (validating || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Invalid link state
  if (validationError || !validationResult?.valid) {
    return (
      <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
        <div className="flex w-full max-w-sm flex-col gap-6">
          <a href="/" className="flex items-center gap-2 self-center font-medium">
            <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
              <GalleryVerticalEnd className="size-4" />
            </div>
            HowMuchAh?
          </a>
          <Card>
            <CardHeader>
              <CardTitle>Invalid Invitation</CardTitle>
              <CardDescription>
                This invitation link is invalid or has expired.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Please contact the group owner for a new invitation link.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Success state
  if (claimStatus === 'success') {
    return (
      <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
        <div className="flex w-full max-w-sm flex-col gap-6">
          <a href="/" className="flex items-center gap-2 self-center font-medium">
            <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
              <GalleryVerticalEnd className="size-4" />
            </div>
            HowMuchAh?
          </a>
          <Card>
            <CardHeader>
              <div className="flex justify-center mb-4">
                <CheckCircle2 className="h-12 w-12 text-green-500" />
              </div>
              <CardTitle className="text-center">Successfully Joined!</CardTitle>
              <CardDescription className="text-center">
                You've been invited to{' '}
                <span className="font-semibold break-words">
                  {validationResult.linkDetails?.groupName}
                </span>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground text-center">
                Redirecting in {countdown} second{countdown !== 1 ? 's' : ''}...
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Error state
  if (claimStatus === 'error') {
    return (
      <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
        <div className="flex w-full max-w-sm flex-col gap-6">
          <a href="/" className="flex items-center gap-2 self-center font-medium">
            <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
              <GalleryVerticalEnd className="size-4" />
            </div>
            HowMuchAh?
          </a>
          <Card>
            <CardHeader>
              <div className="flex justify-center mb-4">
                <XCircle className="h-12 w-12 text-destructive" />
              </div>
              <CardTitle className="text-center">Failed to Join</CardTitle>
              <CardDescription className="text-center">
                Unable to be invited into the group. Please try again or contact the group owner.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground text-center">
                Redirecting in {countdown} second{countdown !== 1 ? 's' : ''}...
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Valid link - show claim form
  const { linkDetails } = validationResult;

  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <a href="/" className="flex items-center gap-2 self-center font-medium">
          <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
            <GalleryVerticalEnd className="size-4" />
          </div>
          HowMuchAh?
        </a>

        <Card>
          <CardHeader>
            <CardTitle>Join Group</CardTitle>
            <CardDescription className="break-words">
              You've been invited to join{' '}
              <span className="font-semibold">{linkDetails?.groupName}</span>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="invitedEmail">
                  Email Address <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="invitedEmail"
                  type="email"
                  placeholder="you@gmail.com"
                  autoComplete="email"
                  {...register('invitedEmail')}
                  disabled={claiming || !!user?.email}
                  className={user?.email ? 'bg-muted' : ''}
                />
                {errors.invitedEmail && (
                  <p className="text-sm text-destructive">{errors.invitedEmail.message}</p>
                )}
              </div>

              {linkDetails && (
                <div className="text-sm text-muted-foreground space-y-1 p-3 bg-muted rounded-lg">
                  <p className="break-words">
                    <span className="font-medium">Invited by:</span> {linkDetails.createdByName}
                  </p>
                  <p>
                    <span className="font-medium">Spots available:</span>{' '}
                    {linkDetails.maxUses - linkDetails.currentUses} / {linkDetails.maxUses}
                  </p>
                  <p>
                    <span className="font-medium">Expires:</span>{' '}
                    {new Date(linkDetails.expiresAt).toLocaleDateString()}
                  </p>
                </div>
              )}

              <Button type="submit" disabled={claiming} className="w-full">
                <UserPlus className="h-4 w-4 mr-2" />
                {claiming ? 'Joining...' : 'Join Group'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}