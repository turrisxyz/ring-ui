package patches.buildTypes

import jetbrains.buildServer.configs.kotlin.v2018_2.*
import jetbrains.buildServer.configs.kotlin.v2018_2.ui.*

/*
This patch script was generated by TeamCity on settings change in UI.
To apply the patch, change the buildType with id = 'UnitTestsAndBuild'
accordingly, and delete the patch script.
*/
changeBuildType(RelativeId("UnitTestsAndBuild")) {
    check(artifactRules == """
        storybook-dist => storybook-dist.zip
        %teamcity.build.workingDir%/npmlogs/*.log=>npmlogsssssssssssssssssssss
        coverage => coverage.zip
        npm-ls.log
        lerna-debug.log
    """.trimIndent()) {
        "Unexpected option value: artifactRules = $artifactRules"
    }
    artifactRules = """
        storybook-dist => storybook-dist.zip
        dist => dist.zip
        %teamcity.build.workingDir%/npmlogs/*.log=>npmlogsssssssssssssssssssss
        coverage => coverage.zip
        npm-ls.log
        lerna-debug.log
    """.trimIndent()
}
