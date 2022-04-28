<?php

namespace App\Http\Controllers;

use App\Events\AlumniRegistered;
use App\Events\UserLoggedIn;
use App\Http\Requests\ForgotPasswordRequest;
use App\Http\Requests\LoginRequest;
use App\Http\Requests\RegisterRequest;
use App\Http\Requests\ResetPasswordRequest;
use App\Models\User;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function register(RegisterRequest $request)
    {
        $user = User::create($request->validated());
        $user->alumnus()->create($request->validated());

        AlumniRegistered::dispatch($user);

        Auth::login($user);

        return $user;
    }

    public function login(LoginRequest $request)
    {
        if (!Auth::attempt($request->validated(), $request->input('remember'))) {
            throw ValidationException::withMessages([
                'email' => 'Wrong email or password.'
            ]);
        }

        $user = Auth::user();

        UserLoggedIn::dispatch($user);

        return $user;
    }

    public function logout()
    {
        Auth::guard('web')->logout();
        
        return 'Successfully logout';
    }

    public function forgotPassword(ForgotPasswordRequest $request)
    {
        $status = Password::sendResetLink($request->validated());

        if ($status !== Password::RESET_LINK_SENT) {
            throw ValidationException::withMessages(['email' => [__($status)]]);
        }

        return __($status);
    }

    public function resetPassword(ResetPasswordRequest $request)
    {
        $status = Password::reset($request->validated(), function ($user, $password) {
            $user->password = $password;
            $user->save();

            event(new PasswordReset($user));
        });

        if ($status !== Password::PASSWORD_RESET) {
            throw ValidationException::withMessages(['email' => [__($status)]]);
        }

        return __($status);
    }
}
