#[tauri::command]
fn open_vscode(path: Option<String>) -> Result<(), String> {
    use std::process::Command;

    #[cfg(windows)]
    use std::os::windows::process::CommandExt;

    let code_cmd = if cfg!(target_os = "windows") {
        "code.cmd"
    } else {
        "code"
    };

    let mut cmd = Command::new(code_cmd);

    if let Some(p) = path {
        cmd.arg(p);
    }

    #[cfg(windows)]
    {
        // Prevents console window from popping up
        const CREATE_NO_WINDOW: u32 = 0x08000000;
        cmd.creation_flags(CREATE_NO_WINDOW);
    }

    cmd.spawn()
        .map_err(|e| format!("Failed to launch VS Code: {}", e))?;

    Ok(())
}

#[tauri::command]
fn get_git(path: String) -> Result<Option<String>, String> {
    use std::io::Read;
    use std::process::{Command, Stdio};
    use std::time::Duration;
    use wait_timeout::ChildExt;

    #[cfg(windows)]
    use std::os::windows::process::CommandExt;

    fn spawn_git_hidden(path: &str) -> Option<std::process::Child> {
        let mut cmd = Command::new("git");
        cmd.args(&["remote", "get-url", "origin"])
            .current_dir(path)
            .stdout(Stdio::piped())
            .stderr(Stdio::null());

        #[cfg(windows)]
        {
            // This prevents terminal popups on Windows
            const CREATE_NO_WINDOW: u32 = 0x08000000;
            cmd.creation_flags(CREATE_NO_WINDOW);
        }

        cmd.spawn().ok()
    }

    let mut child = match spawn_git_hidden(&path) {
        Some(child) => child,
        None => return Ok(None), // Failed to launch
    };

    let timeout = Duration::from_millis(100);
    match child.wait_timeout(timeout).unwrap() {
        Some(status) => {
            if status.success() {
                let mut stdout = String::new();
                if let Some(mut out) = child.stdout.take() {
                    out.read_to_string(&mut stdout).ok();
                }
                Ok(Some(stdout.trim().to_string()))
            } else {
                Ok(None) // Git ran, but not a repo or failed
            }
        }
        None => {
            let _ = child.kill();
            Ok(None) // Timed out
        }
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_store::Builder::new().build())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![open_vscode, get_git])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
