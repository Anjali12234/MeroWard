<!DOCTYPE html>
<html>

<head>
    <meta charset="UTF-8">
    <title>{{ $notice->title ?? 'Notice' }}</title>
</head>

<body>

    <h2>{{ $notice->title ?? 'Notice' }}</h2>

    <p>
        {{ $notice->description ?? '' }}
    </p>
    <a href="{{ $notice->document ?? '' }}" target="_blank">Download Document</a>

</body>

</html>
